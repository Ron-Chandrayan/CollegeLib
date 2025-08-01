# Environment Setup Guide

## API Servers

This application uses **two different API servers**:

1. **Books API**: `https://libman.ethiccode.in` (for book search and management)
2. **Library Management API**: `https://libman.ethiccode.in.net` (for student entry/exit, footfall, etc.)

## For Local Development

Create a `.env` file in the `LibraryManage` directory:

```env
# Books API (for book search)
VITE_BOOKS_API_URL=https://libman.ethiccode.in
VITE_SECRET_KEY2=your-books-api-key-here

# Library Management API (for student management)
VITE_API_URL=https://libman.ethiccode.in.net
VITE_SECRET_KEY=your-library-api-key-here
```

## For Heroku Production

Set these environment variables in your Heroku app:

```bash
# Books API
heroku config:set VITE_BOOKS_API_URL=https://libman.ethiccode.in
heroku config:set VITE_SECRET_KEY2=your-books-api-key-here

# Library Management API
heroku config:set VITE_API_URL=https://libman.ethiccode.in.net
heroku config:set VITE_SECRET_KEY=your-library-api-key-here
```

**Important**: Make sure URLs do NOT have trailing slashes. The correct format is:
- ✅ `https://libman.ethiccode.in`
- ❌ `https://libman.ethiccode.in/`

Or through Heroku Dashboard:
1. Go to your app settings
2. Click "Reveal Config Vars"
3. Add:
   - `VITE_BOOKS_API_URL` = `https://libman.ethiccode.in`
   - `VITE_SECRET_KEY2` = `your-books-api-key`
   - `VITE_API_URL` = `https://libman.ethiccode.in.net`
   - `VITE_SECRET_KEY` = `your-library-api-key`

## How It Works

- **Development**: Uses Vite proxy for both APIs
  - `/api/*` → `https://libman.ethiccode.in/api/*` (Books)
  - `/altapi/*` → `https://libman.ethiccode.in.net/api/*` (Library)
- **Production**: Uses direct API calls to respective servers

The `apiConfig.js` utility automatically detects the environment and uses the appropriate URL strategy.

## Testing

1. **Local**: Run `npm run dev` - should work with proxy
2. **Production**: Deploy to Heroku - should work with direct API calls

## Troubleshooting

- Check browser console for API errors
- Verify environment variables are set correctly
- Ensure API keys are valid
- Check CORS settings on both API servers
- Use the debug function: `debugApiConfig()` in browser console 