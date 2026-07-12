

import mysql.connector
from mysql.connector import Error
from utils.config import DB_CONFIG


def connect_db():
    try:
        connection = mysql.connector.connect(**DB_CONFIG)

        if connection.is_connected():
            return connection

    except Error as e:
        print("❌ Error while connecting to MySQL:", e)
        return None