# PRN Automation Script

This script automates the input of PRN numbers from your MongoDB `fe_students` collection using PyAutoGUI.

## Features

- Connects to MongoDB and fetches PRN numbers from `fe_students` collection
- Automatically types PRN numbers and presses Enter
- Configurable delay between inputs (700ms as specified)
- 20-second delay between automation cycles
- Continuous operation with user-defined iteration counts
- Emergency stop by moving mouse to top-left corner
- Comprehensive logging

## Prerequisites

1. **Python 3.7+** installed on your system
2. **MongoDB** running with your `fe_students` collection
3. **`.env` file** with your MongoDB connection string

## Installation

1. Install the required dependencies:
   ```bash
   pip install -r requirements_automation.txt
   ```

2. Make sure your `.env` file contains the MongoDB URI:
   ```
   MONGO_URI=mongodb://your-connection-string
   ```

## Usage

1. **Prepare your target application**:
   - Open the application where you want to input PRN numbers
   - Make sure the input field is ready to receive text

2. **Run the script**:
   ```bash
   python prn_automation.py
   ```

3. **Follow the prompts**:
   - The script will ask for the number of iterations per cycle
   - Enter a positive number (or 0 to exit)
   - The script will automatically type PRN numbers and press Enter
   - After each cycle, it waits 20 seconds before starting the next cycle

## How it Works

1. **Connection**: Connects to your MongoDB using the `MONGO_URI` from `.env`
2. **Data Fetching**: Retrieves all PRN numbers from the `fe_students` collection
3. **Automation Cycle**:
   - Asks for number of iterations (n)
   - Runs loop n times, fetching next PRN each time
   - Types PRN and presses Enter with 700ms delay
   - Cycles through all PRN numbers in the database
4. **Continuous Operation**: Repeats the entire process after 20-second delay

## Safety Features

- **Failsafe**: Move mouse to top-left corner to stop automation
- **Keyboard Interrupt**: Press Ctrl+C to stop
- **Input Validation**: Validates user input for iteration count
- **Error Handling**: Comprehensive error handling and logging

## Logging

The script creates detailed logs in:
- Console output
- Log file: `prn_automation_YYYYMMDD_HHMMSS.log`

## Troubleshooting

1. **MongoDB Connection Issues**:
   - Check your `.env` file has correct `MONGO_URI`
   - Ensure MongoDB is running and accessible

2. **PyAutoGUI Issues**:
   - Make sure target application is focused
   - Check if any security software is blocking automation
   - On Windows, run as administrator if needed

3. **No PRN Numbers Found**:
   - Verify your `fe_students` collection has data
   - Check if PRN field exists in your documents

## Example Usage

```
PRN Automation Script
====================
This script will:
1. Connect to your MongoDB fe_students collection
2. Fetch PRN numbers from the database
3. Ask you for the number of iterations per cycle
4. Automatically type each PRN and press Enter
5. Wait 20 seconds between cycles
6. Move mouse to top-left corner to stop

Press Enter when you're ready to start (make sure your target application is focused)...

Enter number of times to run the loop for cycle 1 (or 0 to exit): 5
Starting automation cycle with 5 iterations
Inputting PRN: 1234567890
Successfully input PRN: 1234567890
...
Automation cycle completed
Waiting 20 seconds before next cycle...
Next cycle in 20 seconds...
```

## Notes

- The script cycles through all PRN numbers in your database
- If you have more iterations than PRN numbers, it will cycle back to the beginning
- Make sure your target application is ready to receive input before starting
- The 700ms delay is applied after typing each PRN, before pressing Enter
