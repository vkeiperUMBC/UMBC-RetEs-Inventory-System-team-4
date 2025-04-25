import unittest
import sqlite3
import pandas as pd
import os  # For path manipulation

from DBfunc import createExcelDatabase, updateExcelDatabase, createPurchaseDatabase

class TestDatabaseFunctions(unittest.TestCase):

    def setUp(self):
        """Set up a temporary in-memory database for testing."""
        self.conn = sqlite3.connect(':memory:')
        self.cursor = self.conn.cursor()
        # Use the actual Excel file for testing
        self.sample_excel_file = 'test.xlsx'
        if not os.path.exists(self.sample_excel_file):
            raise FileNotFoundError(f"The file '{self.sample_excel_file}' does not exist.")

    def tearDown(self):
        """Clean up the database connection."""
        self.conn.close()

    def fetch_all_current_database(self):
        """Helper function to fetch all data from the current_database table."""
        self.cursor.execute("SELECT * FROM current_database")
        return self.cursor.fetchall()

    def test_createExcelDatabase_from_file(self):
        """Test creating and populating from an actual Excel file."""
        createExcelDatabase(self.cursor, self.sample_excel_file)
        self.conn.commit()  # Commit changes to the in-memory database
        results = self.fetch_all_current_database()
        # Verify the data matches the Excel file
        print("Results from database:", results)
        self.assertGreater(len(results), 0)  # Ensure some data was added

    def test_updateExcelDatabase_from_file(self):
        """Test updating the database from an actual Excel file."""
        # First, populate the database
        createExcelDatabase(self.cursor, self.sample_excel_file)
        self.conn.commit()  # Commit changes to the in-memory database
        # Then, update it
        updateExcelDatabase(self.cursor, self.sample_excel_file)
        self.conn.commit()  # Commit changes to the in-memory database
        results = self.fetch_all_current_database()
        print("Updated results from database:", results)
        self.assertGreater(len(results), 0)  # Ensure some data was updated

    def test_createPurchaseDatabase(self):
        """Test creating the purchase database."""
        createPurchaseDatabase(self.cursor)
        self.conn.commit()  # Commit changes to the in-memory database
        # Verify that the purchase database table is created
        self.cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='purchase_database'")
        table_exists = self.cursor.fetchone()
        self.assertIsNotNone(table_exists)

if __name__ == '__main__':
    unittest.main(argv=['first-arg-is-ignored'], exit=False)