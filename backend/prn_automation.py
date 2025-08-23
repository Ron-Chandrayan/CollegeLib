#!/usr/bin/env python3
"""
PRN Automation Script using PyAutoGUI
Fetches PRN numbers from MongoDB fe_students collection and automates input
"""

import os
import sys
import time
import logging
from datetime import datetime
from typing import List

# Third-party imports
try:
    import pyautogui
    from pymongo import MongoClient
    from pymongo.errors import ConnectionFailure
    from dotenv import load_dotenv
except ImportError as e:
    print(f"Missing required dependency: {e}")
    print("Please install required packages:")
    print("pip install pyautogui pymongo python-dotenv")
    sys.exit(1)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler(f'prn_automation_{datetime.now().strftime("%Y%m%d_%H%M%S")}.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

class PRNAutomation:
    def __init__(self):
        """Initialize the PRN Automation with MongoDB connection"""
        load_dotenv()
        self.mongo_uri = os.getenv('MONGO_URI')
        
        if not self.mongo_uri:
            raise ValueError("MONGO_URI not found in .env file")
        
        self.client = None
        self.db = None
        self.collection = None
        self.prn_list = []
        self.current_index = 0
        
        # Configure PyAutoGUI
        pyautogui.FAILSAFE = True  # Move mouse to corner to stop
        pyautogui.PAUSE = 0.1  # Small pause between actions
        
    def connect_to_mongodb(self):
        """Establish connection to MongoDB"""
        try:
            self.client = MongoClient(self.mongo_uri)
            # Test the connection
            self.client.admin.command('ping')
            
            # Get database and collection
            db_name = self.mongo_uri.split('/')[-1].split('?')[0]
            self.db = self.client[db_name]
            self.collection = self.db['fe_students']
            
            logger.info(f"Connected to MongoDB database: {db_name}")
            logger.info(f"Using collection: fe_students")
            
        except ConnectionFailure as e:
            logger.error(f"Failed to connect to MongoDB: {e}")
            raise
        except Exception as e:
            logger.error(f"Error connecting to MongoDB: {e}")
            raise
    
    def fetch_prn_numbers(self):
        """Fetch all PRN numbers from the fe_students collection"""
        try:
            # Fetch all PRN numbers from the collection
            cursor = self.collection.find({}, {'PRN': 1, '_id': 0})
            self.prn_list = [doc['PRN'] for doc in cursor]
            
            logger.info(f"Fetched {len(self.prn_list)} PRN numbers from database")
            
            if not self.prn_list:
                logger.warning("No PRN numbers found in the collection")
                return False
                
            return True
            
        except Exception as e:
            logger.error(f"Error fetching PRN numbers: {e}")
            return False
    
    def get_next_prn(self):
        """Get the next PRN from the list, cycling back to the beginning"""
        if not self.prn_list:
            return None
            
        prn = self.prn_list[self.current_index]
        self.current_index = (self.current_index + 1) % len(self.prn_list)
        return prn
    
    def input_prn(self, prn: str):
        """Input a PRN number using PyAutoGUI"""
        try:
            logger.info(f"Inputting PRN: {prn}")
            
            # Type the PRN number
            pyautogui.typewrite(str(prn))
            
            # Wait 700ms as specified
            time.sleep(0.7)
            
            # Press Enter
            pyautogui.press('enter')
            
            logger.info(f"Successfully input PRN: {prn}")
            
        except Exception as e:
            logger.error(f"Error inputting PRN {prn}: {e}")
    
    def run_automation_cycle(self, n: int):
        """Run one complete automation cycle"""
        logger.info(f"Starting automation cycle with {n} iterations")
        
        for i in range(n):
            prn = self.get_next_prn()
            if prn is None:
                logger.error("No PRN available")
                return False
                
            logger.info(f"Iteration {i+1}/{n}: Processing PRN {prn}")
            self.input_prn(prn)
            
            # Small delay between iterations (optional)
            time.sleep(0.3)
        
        logger.info("Automation cycle completed")
        return True
    
    def run_continuous_automation(self):
        """Run the automation continuously with 20-second delays between cycles"""
        logger.info("Starting continuous PRN automation")
        logger.info("Move mouse to top-left corner to stop the automation")
        
        cycle_count = 1
        
        try:
            while True:
                logger.info(f"=== Starting Cycle {cycle_count} ===")
                
                # Get user input for number of iterations
                try:
                    n = int(input(f"\nEnter number of times to run the loop for cycle {cycle_count} (or 0 to exit): "))
                    time.sleep(5)
                    if n == 0:
                        logger.info("Exiting automation")
                        break
                    if n < 1:
                        print("Please enter a positive number")
                        continue
                except ValueError:
                    print("Please enter a valid number")
                    continue
                
                # Run the automation cycle
                success = self.run_automation_cycle(n)
                
                if not success:
                    logger.error("Automation cycle failed")
                    break
                
                cycle_count += 1
                
                # Wait 20 seconds before next cycle
                logger.info("Waiting 20 seconds before next cycle...")
                for remaining in range(20, 0, -1):
                    print(f"\rNext cycle in {remaining} seconds...", end="", flush=True)
                    time.sleep(1)
                print()  # New line after countdown
                
        except KeyboardInterrupt:
            logger.info("Automation stopped by user")
        except Exception as e:
            logger.error(f"Unexpected error: {e}")
        finally:
            self.cleanup()
    
    def cleanup(self):
        """Clean up resources"""
        if self.client:
            self.client.close()
            logger.info("MongoDB connection closed")
    
    def run(self):
        """Main method to run the automation"""
        try:
            # Connect to MongoDB
            self.connect_to_mongodb()
            
            # Fetch PRN numbers
            if not self.fetch_prn_numbers():
                logger.error("Failed to fetch PRN numbers")
                return
            
            # Start continuous automation
            self.run_continuous_automation()
            
        except Exception as e:
            logger.error(f"Error in automation: {e}")
        finally:
            self.cleanup()

def main():
    """Main function"""
    print("PRN Automation Script")
    print("====================")
    print("This script will:")
    print("1. Connect to your MongoDB fe_students collection")
    print("2. Fetch PRN numbers from the database")
    print("3. Ask you for the number of iterations per cycle")
    print("4. Automatically type each PRN and press Enter")
    print("5. Wait 20 seconds between cycles")
    print("6. Move mouse to top-left corner to stop")
    print()
    
    # Give user time to switch to the target application
    input("Press Enter when you're ready to start (make sure your target application is focused)...")
    
    # Create and run the automation
    automation = PRNAutomation()
    automation.run()

if __name__ == "__main__":
    main()
