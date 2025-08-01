# Environment Setup Guide

## For Local Development

Create a `.env` file in the `LibraryManage` directory:

```env
VITE_API_URL=https://libman.ethiccode.in
VITE_SECRET_KEY2=your-api-key-here
```

## For Heroku Production

Set these environment variables in your Heroku app:

```bash
heroku config:set VITE_API_URL=https://libman.ethiccode.in
heroku config:set VITE_SECRET_KEY2=your-api-key-here
```

Or through Heroku Dashboard:
1. Go to your app settings
2. Click "Reveal Config Vars"
3. Add:
   - `VITE_API_URL` = `https://libman.ethiccode.in`
   - `VITE_SECRET_KEY2` = `your-actual-api-key`

## How It Works

- **Development**: Uses Vite proxy (`/api/*` → `https://libman.ethiccode.in/api/*`)
- **Production**: Uses direct API calls to `VITE_API_URL`

The `apiConfig.js` utility automatically detects the environment and uses the appropriate URL strategy.

## Testing

1. **Local**: Run `npm run dev` - should work with proxy
2. **Production**: Deploy to Heroku - should work with direct API calls

## Troubleshooting

- Check browser console for API errors
- Verify environment variables are set correctly
- Ensure API key is valid
- Check CORS settings on the API server 