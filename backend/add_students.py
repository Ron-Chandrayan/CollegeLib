#!/usr/bin/env python3
"""
MongoDB Student Data Import Script
Adds student entries from CSV file to fe_students collection
"""

import csv
import os
import sys
from typing import Dict, List, Tuple
import logging
from datetime import datetime

# Third-party imports
try:
    import pandas as pd
    from pymongo import MongoClient, InsertOne
    from pymongo.errors import ConnectionFailure, BulkWriteError, DuplicateKeyError
    from dotenv import load_dotenv
except ImportError as e:
    print(f"Missing required dependency: {e}")
    print("Please install required packages:")
    print("pip install pymongo python-dotenv pandas")
    sys.exit(1)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler(f'student_import_{datetime.now().strftime("%Y%m%d_%H%M%S")}.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

class StudentImporter:
    def __init__(self):
        """Initialize the StudentImporter with MongoDB connection"""
        load_dotenv()
        self.mongo_uri = os.getenv('MONGO_URI')
        
        if not self.mongo_uri:
            raise ValueError("MONGO_URI not found in .env file")
        
        self.client = None
        self.db = None
        self.collection = None
        
    def connect_to_mongodb(self):
        """Establish connection to MongoDB"""
        try:
            self.client = MongoClient(self.mongo_uri)
            # Test the connection
            self.client.admin.command('ping')
            
            # Get database and collection
            # Assuming database name from your models - adjust if needed
            db_name = self.mongo_uri.split('/')[-1].split('?')[0]
            self.db = self.client[db_name]
            self.collection = self.db['fe_students']  # Collection name from FeStudent model
            
            logger.info(f"Connected to MongoDB database: {db_name}")
            logger.info(f"Using collection: fe_students")
            
        except ConnectionFailure as e:
            logger.error(f"Failed to connect to MongoDB: {e}")
            raise
        except Exception as e:
            logger.error(f"Error connecting to MongoDB: {e}")
            raise
    
    def load_csv_data(self, csv_file_path: str) -> List[Dict]:
        """
        Load CSV data and create student documents
        
        Args:
            csv_file_path: Path to the CSV file
            
        Returns:
            List of student documents to insert
        """
        student_documents = []
        
        try:
            # Read CSV file
            df = pd.read_csv(csv_file_path)
            
            # Clean column names (remove any extra spaces)
            df.columns = df.columns.str.strip()
            
            # Check if required columns exist
            required_columns = ['PRN', 'Name', 'mail']
            missing_columns = [col for col in required_columns if col not in df.columns]
            
            if missing_columns:
                raise ValueError(f"Missing required columns in CSV: {missing_columns}")
            
            # Process each row
            for index, row in df.iterrows():
                prn = str(row['PRN']).strip()
                name = str(row['Name']).strip()
                email = str(row['mail']).strip()
                
                # Skip empty rows
                if pd.isna(row['PRN']) or pd.isna(row['Name']) or pd.isna(row['mail']):
                    logger.warning(f"Skipping row {index + 1}: Missing required data")
                    continue
                
                # Skip if any field is empty
                if not prn or not name or not email:
                    logger.warning(f"Skipping row {index + 1}: Empty required fields")
                    continue
                
                # Basic email validation
                if '@' not in email or '.' not in email:
                    logger.warning(f"Invalid email format for PRN {prn}: {email}")
                    continue
                
                # Extract batch from PRN (assuming format like 122A1001)
                batch = None
                if len(prn) >= 4:
                    batch = prn[:4]  # First 4 characters as batch
                
                # Extract division from PRN (assuming format like 122A1001)
                division = None
                if len(prn) >= 5:
                    division = prn[4]  # 5th character as division
                
                # Create student document
                student_doc = {
                    'PRN': prn,
                    'name': name,
                    'email': email,
                    'batch': batch,
                    'division': division
                }
                
                student_documents.append(student_doc)
            
            logger.info(f"Loaded {len(student_documents)} student documents from CSV")
            return student_documents
            
        except FileNotFoundError:
            logger.error(f"CSV file not found: {csv_file_path}")
            raise
        except Exception as e:
            logger.error(f"Error reading CSV file: {e}")
            raise
    
    def check_existing_students(self, student_documents: List[Dict]) -> Tuple[List[Dict], List[Dict]]:
        """
        Check which students already exist in the database
        
        Args:
            student_documents: List of student documents to insert
            
        Returns:
            Tuple of (new_students, existing_students)
        """
        try:
            # Get all existing PRNs
            existing_prns = set()
            cursor = self.collection.find({}, {"PRN": 1})
            for doc in cursor:
                existing_prns.add(doc['PRN'])
            
            logger.info(f"Found {len(existing_prns)} existing students in database")
            
            # Separate new and existing students
            new_students = []
            existing_students = []
            
            for student in student_documents:
                if student['PRN'] in existing_prns:
                    existing_students.append(student)
                else:
                    new_students.append(student)
            
            logger.info(f"New students to insert: {len(new_students)}")
            logger.info(f"Students already exist: {len(existing_students)}")
            
            return new_students, existing_students
            
        except Exception as e:
            logger.error(f"Error checking existing students: {e}")
            raise
    
    def create_bulk_operations(self, student_documents: List[Dict]) -> List[Dict]:
        """
        Create bulk insert operations
        
        Args:
            student_documents: List of student documents to insert
            
        Returns:
            List of bulk insert operations
        """
        bulk_operations = []
        
        for student in student_documents:
            bulk_operations.append(
                InsertOne(student)
            )
        
        logger.info(f"Created {len(bulk_operations)} bulk insert operations")
        return bulk_operations
    
    def execute_bulk_inserts(self, bulk_operations: List[Dict]) -> Tuple[int, int]:
        """
        Execute bulk insert operations
        
        Args:
            bulk_operations: List of bulk insert operations
            
        Returns:
            Tuple of (successful_inserts, failed_inserts)
        """
        if not bulk_operations:
            logger.info("No bulk operations to execute")
            return 0, 0
        
        try:
            logger.info(f"Executing {len(bulk_operations)} bulk insert operations...")
            
            result = self.collection.bulk_write(bulk_operations, ordered=False)
            
            successful_inserts = result.inserted_count
            failed_inserts = len(bulk_operations) - successful_inserts
            
            logger.info(f"Bulk insert completed:")
            logger.info(f"  - Successful inserts: {successful_inserts}")
            logger.info(f"  - Failed inserts: {failed_inserts}")
            
            return successful_inserts, failed_inserts
            
        except BulkWriteError as e:
            logger.error(f"Bulk write error: {e.details}")
            
            # Count successful operations
            successful_inserts = 0
            failed_inserts = 0
            
            for error in e.details.get('writeErrors', []):
                if error.get('code') == 11000:  # Duplicate key error
                    failed_inserts += 1
                    logger.warning(f"Duplicate key error for PRN: {error.get('op', {}).get('PRN', 'Unknown')}")
                else:
                    failed_inserts += 1
            
            successful_inserts = len(bulk_operations) - failed_inserts
            
            return successful_inserts, failed_inserts
            
        except Exception as e:
            logger.error(f"Error executing bulk inserts: {e}")
            raise
    
    def create_indexes(self):
        """Create indexes for better performance"""
        try:
            # Create unique index on PRN
            self.collection.create_index("PRN", unique=True)
            logger.info("Created unique index on PRN field")
            
            # Create index on email for faster lookups
            self.collection.create_index("email")
            logger.info("Created index on email field")
            
            # Create index on batch for filtering
            self.collection.create_index("batch")
            logger.info("Created index on batch field")
            
        except Exception as e:
            logger.error(f"Error creating indexes: {e}")
    
    def run_import(self, csv_file_path: str = "dse_2027.csv"):
        """
        Main method to run the student import process
        
        Args:
            csv_file_path: Path to the CSV file containing student data
        """
        try:
            logger.info("Starting student import process...")
            
            # Connect to MongoDB
            self.connect_to_mongodb()
            
            # Create indexes
            self.create_indexes()
            
            # Load CSV data
            student_documents = self.load_csv_data(csv_file_path)
            
            # Check existing students
            new_students, existing_students = self.check_existing_students(student_documents)
            
            if not new_students:
                logger.info("No new students to insert")
                return 0, 0
            
            # Create bulk operations
            bulk_operations = self.create_bulk_operations(new_students)
            
            # Execute inserts
            successful, failed = self.execute_bulk_inserts(bulk_operations)
            
            logger.info("Student import process completed successfully!")
            logger.info(f"Summary: {successful} successful inserts, {failed} failed inserts")
            
            return successful, failed
            
        except Exception as e:
            logger.error(f"Student import process failed: {e}")
            raise
        finally:
            if self.client:
                self.client.close()
                logger.info("MongoDB connection closed")

def main():
    """Main function"""
    try:
        importer = StudentImporter()
        successful, failed = importer.run_import()
        
        print(f"\n{'='*50}")
        print("STUDENT IMPORT SUMMARY")
        print(f"{'='*50}")
        print(f"Successful inserts: {successful}")
        print(f"Failed inserts: {failed}")
        print(f"{'='*50}")
        
        if failed > 0:
            print("⚠️  Some inserts failed. Check the log file for details.")
        else:
            print("✅ All inserts completed successfully!")
            
    except Exception as e:
        print(f"❌ Script failed: {e}")
        logger.error(f"Script execution failed: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
