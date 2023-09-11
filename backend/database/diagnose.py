#!/usr/bin/env python3

import sqlite3
import os

def print_db_info(db_path):
    # Connect to the SQLite database
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    # Fetch all table names
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
    tables = cursor.fetchall()

    for table_name in tables:
        table_name = table_name[0]
        print(f"Table: {table_name}")

        # Print schema for the table
        cursor.execute(f"PRAGMA table_info({table_name});")
        columns = cursor.fetchall()
        for column in columns:
            print(f"  Column: {column[1]} (Type: {column[2]}, PK: {column[5]})")

        # Print number of rows in the table
        cursor.execute(f"SELECT COUNT(*) FROM {table_name};")
        row_count = cursor.fetchone()[0]
        print(f"  Number of rows: {row_count}")

        # Fetch and print all rows from the table
        cursor.execute(f"SELECT * FROM {table_name};")
        rows = cursor.fetchall()
        for row in rows:
            print("  ", row)
        
        print('-' * 50)

    # Close the connection
    conn.close()

if __name__ == "__main__":
    script_dir = os.path.dirname(os.path.abspath(__file__))
    db_path = os.path.join(script_dir, "database.sqlite3")
    print_db_info(db_path)
