# Import the libraries
import pandas as pd
import mysql.connector
from mysql.connector import Error



#  Function for reading the csv file.
def read_csv(filepath):
    return pd. read_csv(filepath)

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

#  Function to execute the sql queries.
def query_execute():
    pass

# Function to commit the sql queries.
def query_commit():
    pass


# Function to return the sql query with its data from the csv file.
def insert_province(csvfile):
    provinces = csvfile['Province'].unique()

    for province in provinces:
        print(province)
        sql = f"INSERT INTO provinces (province_name) VALUES (%s)"

        cursor.execute(sql, (province,))

    db_conn.commit()

# Path for the csv file
electionResultsCSV = read_csv('data/National.csv')

# Connect with the database
db_conn = db_connection(
                        'localhost',
                        'root',
                        'dadt@midterm',
                        'election_results'
)

# 
if db_conn.is_connected():
    cursor = db_conn.cursor()

    insert_province(electionResultsCSV)

    # provinces = electionResultsCSV['Province'].unique()

    # for province in provinces:
    #     print(province)
    #     sql = f"INSERT INTO provinces (province_name) VALUES (%s)"

    #     cursor.execute(sql, (province,))

    # db_conn.commit()