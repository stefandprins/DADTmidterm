# Import the libraries
import pandas as pd
import mysql.connector
from mysql.connector import Error

# --------------------------------------------------------------------------------------------------------
# I have coded the database connection based on examples from youtube.
# --------------------------------------------------------------------------------------------------------

#  Function for reading the csv file.
def read_csv(filepath):

    df = pd.read_csv(filepath)
    # df = pd.read_parquet(filepath)

    filtered_df = df[df['Province'].str.strip() != 'Out of Country']
    
    return filtered_df

# Function for connecting with the database
def db_connection(hostName, userName, userPassword, dbName):
    try:
        connection = mysql.connector.connect(
            host = hostName,
            user = userName,
            password = userPassword,
            database = dbName
        )
        print('Connected with the database - success!!')
        return connection
    except Error as e:
        print(f'Error: {e}')
        return None

# --------------------------------------------------------------------------------------------------------
# I have coded this part and refactored the code into its own functions.
# --------------------------------------------------------------------------------------------------------

#  Function to execute the sql queries.
def query_execute(cursor, sql, data=None):
    try:
        if sql:
            cursor.execute(sql, data)
        else:
            cursor.execute(sql)
    except Error as e:
        print(f"Execute error occurred: {e}")

#  Function to execute the sql queries.
def query_executemany(cursor, sql, data=None):
    try:
        if sql:
            cursor.executemany(sql, data)
        else:
            cursor.executemany(sql)
    except Error as e:
        print(f"Execute many error occurred: {e}")

# Function to commit the sql queries.
def query_commit(db_conn):
    try:
        db_conn.commit()
    except Error as e:
        print(f"Commit error occurred: {e}")


# Function to insert the province data into the table.
def insert_province(cursor, db_conn, csvfile):
    provinces = csvfile['Province'].unique()

    # Track the id of the provinces
    province_ids = {}

    # Define the sql queries
    insert_sql = f"INSERT INTO provinces (province_name) VALUES (%s)"
    select_sql = "SELECT provinceID FROM provinces WHERE province_name = %s"

    for province in provinces:
        # Insert the province data into the database.
        query_execute(cursor, insert_sql, (province,))

        # Select the id of the province.
        query_execute(cursor, select_sql, (province,))

        # Store the province id
        province_id = cursor.fetchone()[0]
        province_ids[province] = province_id

    query_commit(db_conn)

    return province_ids


# Function to insert the municipality data into the table.
def insert_municipality(cursor, db_conn, csvfile, province_ids):
    csvfile.columns = csvfile.columns.str.strip()
    filtered = csvfile[csvfile['Municipality'].str.contains(' - ')]
    unique_pairs = filtered[['Municipality', 'Province']].drop_duplicates().values

    # Track the id of the municipalities
    municipality_ids = {}

    # Define the sql queries
    insert_sql = f"INSERT INTO municipalities (municipality_name, provinceID) VALUES (%s, %s)"
    select_sql = "SELECT municipalityID FROM municipalities WHERE municipality_name = %s"

    for municipality, province in unique_pairs:

        # Read the province ID that was stored
        province_id = province_ids[province]

        # Read the municipality names but remove the prefix
        municipality_name = municipality.split(' - ', 1)[1]     

        # Insert the municipality data into the database.
        query_execute(cursor, insert_sql, (municipality_name, province_id))

        # Select the id of the municipality.
        query_execute(cursor, select_sql, (municipality_name,))

        # Store the municipality id
        municipality_id = cursor.fetchone()[0]
        municipality_ids[municipality_name] = municipality_id

    query_commit(db_conn)
    return municipality_ids

# Function to insert the municipality data into the table.
def insert_voting_districts(cursor, db_conn, csvfile, municipality_ids):
    csvfile.columns = csvfile.columns.str.strip()
    filtered = csvfile[csvfile['Municipality'].str.contains(' - ')]
    unique_voting_districts = filtered[['VD_Number', 'VS_Name', 'Registered_Population', 'Spoilt_Votes', 'Total_Valid_Votes', 'Municipality']].drop_duplicates()

    # Track the id of the voting districts
    voting_districts_ids = {}

    # Define the sql queries
    insert_sql = f"INSERT INTO voting_districts (vd_number, vs_name, registered_voters, spoilt_votes, total_votes, municipalityID) VALUES (%s, %s, %s, %s, %s, %s)"
    select_sql = "SELECT vd_number FROM voting_districts WHERE vd_number = %s"

    # Define the batch size for the insert.
    batchSize = 10000
    batch = []

    for index, row in unique_voting_districts.iterrows():
        
        # Read the province ID that was stored
        municipality_name = row['Municipality'].split(' - ', 1)[1]
        municipality_id = municipality_ids[municipality_name]

        # Store the values in the batch array.
        batch.append((row['VD_Number'], row['VS_Name'], row['Registered_Population'], row['Spoilt_Votes'], row['Total_Valid_Votes'], municipality_id))

        if len(batch) >= batchSize:
            # Insert the voting districts data into the database.
            query_executemany(cursor, insert_sql, batch)
            query_commit(db_conn)
            batch = []  # clear the batch

    if batch:
        # Insert the voting districts data into the database.
        query_executemany(cursor,insert_sql, batch)
        query_commit(db_conn)

    for index, row in unique_voting_districts.iterrows():
        # Select the id of the voting districts.
        query_execute(cursor, select_sql, (row['VD_Number'],))

        voting_districts_id = cursor.fetchone()[0]
        voting_districts_ids[row['VD_Number']] = voting_districts_id

    return voting_districts_ids


# Function to insert the municipality data into the table.
def insert_parties(cursor, db_conn, csvfile):
    csvfile.columns = csvfile.columns.str.strip()
    unique_party_name = csvfile[['sPartyName']].drop_duplicates()
    
    # Track the id of the voting districts
    party_ids = {}

    # Define the sql queries
    insert_sql = f"INSERT INTO parties (party_name) VALUES (%s)"
    select_sql = "SELECT partyID FROM parties WHERE party_name = %s"

    for index, row in unique_party_name.iterrows():
        # Insert the parties data into the database.
        query_execute(cursor, insert_sql, (row['sPartyName'],))
        
        # Select the id of the parties.
        query_execute(cursor, select_sql, (row['sPartyName'],))

        party_id = cursor.fetchone()[0]
        party_ids[row['sPartyName']] = party_id

    query_commit(db_conn)
    return party_ids

# Function to insert the results data into the table.
def insert_results(cursor, db_conn, csvfile, voting_districts_ids, party_ids):
    csvfile.columns = csvfile.columns.str.strip()
    unique_party_results = csvfile[['VD_Number', 'sPartyName', 'Party_Votes']].drop_duplicates()

    # Define the sql queries
    insert_sql = f"INSERT INTO party_results (vd_numberID, partyID, party_result) VALUES (%s, %s, %s)"

    # Define the batch
    batchSize = 10000
    batch = []

    for index, row in unique_party_results.iterrows():
        # Read the IDs 
        vd_number_id = voting_districts_ids[row['VD_Number']]
        party_id = party_ids[row['sPartyName']]

        # Store the values in the batch array.
        batch.append((vd_number_id, party_id, row['Party_Votes']))

        if len(batch) >= batchSize:
            # Insert the results data into the database.
            query_executemany(cursor,insert_sql, batch)
            query_commit(db_conn)
            batch = []  # clear the batch

    if batch:
        # Insert the results data into the database.
        query_executemany(cursor,insert_sql, batch)


# --------------------------------------------------------------------------------------------------------
# Running the custom functions
# --------------------------------------------------------------------------------------------------------


# Path for the csv file
electionResultsCSV = read_csv('data/National.csv')
# electionResultsCSV = read_csv('data/file.parquet')


# Connect with the database
db_conn = db_connection(
                        '127.0.0.1',
                        'root',
                        'dadt@midterm',
                        'election_results'
)

# Run the custom function when database is connected


if db_conn.is_connected():
    cursor = db_conn.cursor()

    # Call this function to insert the province data to the table.
    province_ids = insert_province(cursor, db_conn, electionResultsCSV)

    # Call this function to insert the municipality data to the table.
    municipality_ids = insert_municipality(cursor, db_conn, electionResultsCSV, province_ids)

    # Call this function to insert the voting district data to the table.
    voting_districts_ids = insert_voting_districts(cursor, db_conn, electionResultsCSV, municipality_ids)
    # print(voting_districts_ids)
    # Call this function to insert the party data to the table.
    party_ids = insert_parties(cursor, db_conn, electionResultsCSV)

    insert_results(cursor, db_conn, electionResultsCSV, voting_districts_ids, party_ids)