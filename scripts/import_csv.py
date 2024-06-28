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
    

# Path for the csv file
readCSVPath = read_csv('./import_csv.py')

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