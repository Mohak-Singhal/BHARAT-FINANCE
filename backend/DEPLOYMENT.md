# Deployment Guide - Bharat Finance Platform

## Free Tier Deployment Options

### 1. Render.com (Recommended)

**Steps:**
1. Fork/clone the repository
2. Create account on [Render.com](https://render.com)
3. Connect your GitHub repository
4. Use the provided `deploy/render.yaml` configuration
5. Set environment variables in Render dashboard:
   - `GEMINI_API_KEY`: Your Gemini API key
   - `SECRET_KEY`: Random secret key
6. Deploy automatically

**Render Configuration:**
- Runtime: Python 3.11
- Build Command: `pip install -r requirements.txt`
- Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- Health Check: `/health`

### 2. Railway.app

**Steps:**
1. Install Railway CLI: `npm install -g @railway/cli`
2. Login: `railway login`
3. Deploy: `railway up`
4. Set environment variables:
   ```bash
   railway variables set GEMINI_API_KEY=your_key_here
   railway variables set SECRET_KEY=your_secret_key
   ```

### 3. Fly.io

**Steps:**
1. Install Fly CLI: `curl -L https://fly.io/install.sh | sh`
2. Login: `fly auth login`
3. Create app: `fly launch`
4. Set secrets:
   ```bash
   fly secrets set GEMINI_API_KEY=your_key_here
   fly secrets set SECRET_KEY=your_secret_key
   ```
5. Deploy: `fly deploy`

### 4. Vercel (Serverless)

**Steps:**
1. Install Vercel CLI: `npm i -g vercel`
2. Create `vercel.json`:
   ```json
   {
     "builds": [{"src": "app/main.py", "use": "@vercel/python"}],
     "routes": [{"src": "/(.*)", "dest": "app/main.py"}]
   }
   ```
3. Deploy: `vercel --prod`

## Local Development

### Prerequisites
- Python 3.8+
- Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey)

### Setup
```bash
# Clone repository
git clone <repository-url>
cd bharat-finance-platform

# Run setup script
chmod +x scripts/setup.sh
./scripts/setup.sh

# Or manual setup:
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env and add your GEMINI_API_KEY

# Run development server
uvicorn app.main:app --reload
```

### Docker Development
```bash
# Build and run with Docker Compose
docker-compose up --build

# Or with Docker only
docker build -t bharat-finance .
docker run -p 8000:8000 --env-file .env bharat-finance
```

## Environment Variables

### Required
- `GEMINI_API_KEY`: Your Gemini API key from Google AI Studio

### Optional
- `DATABASE_URL`: Database connection string (default: SQLite)
- `SECRET_KEY`: Secret key for security (auto-generated in production)
- `ENVIRONMENT`: Environment name (development/production)
- `CORS_ORIGINS`: Allowed CORS origins (comma-separated)

## Database Setup

### SQLite (Default - Free Tier)
- Automatically created on first run
- File-based database: `bharat_finance.db`
- Perfect for development and small deployments

### PostgreSQL (Production)
```bash
# Update DATABASE_URL in .env
DATABASE_URL=postgresql://user:password@host:port/database

# Install PostgreSQL adapter
pip install psycopg2-binary
```

### Supabase (Free PostgreSQL)
1. Create account at [Supabase](https://supabase.com)
2. Create new project
3. Get connection string from Settings > Database
4. Update `DATABASE_URL` in environment variables

## API Documentation

Once deployed, visit:
- **Swagger UI**: `https://your-domain.com/docs`
- **ReDoc**: `https://your-domain.com/redoc`
- **Health Check**: `https://your-domain.com/health`

## Performance Optimization

### Free Tier Limits
- **Render**: 750 hours/month, sleeps after 15min inactivity
- **Railway**: $5 credit/month, then pay-as-you-go
- **Fly.io**: 3 shared-cpu-1x VMs, 160GB bandwidth
- **Vercel**: 100GB bandwidth, 10s execution limit

### Optimization Tips
1. **Caching**: Implement Redis for API response caching
2. **Database**: Use connection pooling for PostgreSQL
3. **AI Calls**: Cache Gemini responses for common queries
4. **Static Assets**: Use CDN for frontend assets

## Monitoring & Logging

### Health Monitoring
```python
# Built-in health check endpoint
GET /health
```

### Error Tracking
- Use Sentry for error tracking (free tier available)
- Add to requirements: `sentry-sdk[fastapi]`

### Logging
```python
import logging
logging.basicConfig(level=logging.INFO)
```

## Security Considerations

### API Security
- Rate limiting implemented
- Input validation with Pydantic
- CORS properly configured
- Environment variables for secrets

### Production Checklist
- [ ] Change default SECRET_KEY
- [ ] Enable HTTPS
- [ ] Set proper CORS origins
- [ ] Use strong database passwords
- [ ] Enable API rate limiting
- [ ] Set up monitoring alerts

## Scaling

### Horizontal Scaling
- Use load balancer (nginx/cloudflare)
- Multiple app instances
- Shared database/cache

### Database Scaling
- Read replicas for PostgreSQL
- Connection pooling
- Query optimization

### Caching Strategy
- Redis for session/API caching
- CDN for static content
- Database query caching

## Troubleshooting

### Common Issues

**1. Gemini API Errors**
```
Error: API Error: 401
Solution: Check GEMINI_API_KEY in environment variables
```

**2. Database Connection**
```
Error: Could not connect to database
Solution: Verify DATABASE_URL format and credentials
```

**3. Import Errors**
```
Error: ModuleNotFoundError
Solution: Ensure all dependencies in requirements.txt are installed
```

**4. CORS Issues**
```
Error: CORS policy blocked
Solution: Add frontend domain to CORS_ORIGINS
```

### Debug Mode
```bash
# Enable debug logging
export LOG_LEVEL=DEBUG
uvicorn app.main:app --reload --log-level debug
```

## Support

- **Documentation**: Check `/docs` endpoint
- **Examples**: See `examples/` directory
- **Issues**: Create GitHub issue with error details
- **Community**: Join discussions for help

## License

This project is open source and available under the MIT License.