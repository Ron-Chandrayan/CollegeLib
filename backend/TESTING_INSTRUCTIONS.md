# Testing the Library Attendance API Migration

This document provides instructions for testing the new Node.js implementation of the library attendance API before integrating it into the main application.

## Setup

1. Make sure you have installed all dependencies:
   ```
   cd backend
   npm install
   ```

2. Ensure the `.env` file contains the necessary environment variables:
   - `API_KEY` - Your API key for the library attendance system

## Testing the Backend

1. Start the test server:
   ```
   npm run test-library
   ```

2. The server will start on port 5050 (or the port specified in the `TEST_PORT` environment variable).

3. Verify the server is running by accessing:
   ```
   http://localhost:5050/test
   ```
   You should see a JSON response indicating the server is running.

4. Test individual endpoints using a tool like Postman or curl:

   - Get the last entry:
     ```
     curl -H "XApiKey: YOUR_API_KEY" http://localhost:5050/api/library/last_entry
     ```

   - Get all students:
     ```
     curl -H "XApiKey: YOUR_API_KEY" http://localhost:5050/api/library/list_all
     ```

   - Get today's footfall:
     ```
     curl -H "XApiKey: YOUR_API_KEY" http://localhost:5050/api/library/todays_footfall
     ```

   - Get total footfall:
     ```
     curl -H "XApiKey: YOUR_API_KEY" http://localhost:5050/api/library/total_footfall
     ```

   - Get dashboard data:
     ```
     curl -H "XApiKey: YOUR_API_KEY" http://localhost:5050/api/library/dashboard
     ```

   - Health check:
     ```
     curl http://localhost:5050/api/library/health
     ```

   - Clear cache:
     ```
     curl -X POST -H "XApiKey: YOUR_API_KEY" http://localhost:5050/api/library/cache/clear
     ```

   - IN/OUT action:
     ```
     curl -X POST -H "XApiKey: YOUR_API_KEY" -H "Content-Type: application/json" -d '{"PRN":"123456","purpose":"Study"}' http://localhost:5050/api/library/in_out
     ```

## Testing with the Frontend

1. Keep the test server running.

2. In a separate terminal, start the frontend with the test configuration:
   ```
   cd LibraryManage
   npm run dev:test
   ```

3. The frontend will start and connect to the test server for library attendance API endpoints.

4. Test the library attendance features in the application.

## Comparing with the Original Implementation

To compare the results with the original Flask implementation:

1. Make requests to both endpoints and compare the responses:
   - Original: `https://libman.ethiccode.in.net/api/dashboard`
   - New: `http://localhost:5050/api/library/dashboard`

2. Check for:
   - Response structure
   - Response time
   - Error handling
   - Data accuracy

## Troubleshooting

If you encounter issues:

1. Check the console output for error messages.

2. Verify the API key is being sent correctly.

3. Ensure the library attendance system is accessible from your network.

4. Check that cheerio is parsing the HTML correctly by examining the response data.

## Next Steps

Once testing is complete and you're satisfied with the results:

1. Integrate the changes into the main application by following the steps in `README_LIBRARY_MIGRATION.md`.

2. Monitor the application after integration to ensure everything is working as expected.
