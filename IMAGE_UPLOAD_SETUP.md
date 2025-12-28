# Image Upload Configuration Guide

## Overview
Image upload middleware ab **dual-mode** mein kaam karta hai:
- **Local Storage**: Development ke liye - images local server pe save hongi
- **Cloudinary**: Production ke liye - images cloud pe save hongi

## Environment Variable

### IMG_ENV
`.env` file mein `IMG_ENV` variable set karein:

```env
IMG_ENV=local        # For local storage
IMG_ENV=cloudinary   # For Cloudinary storage
```

---

## Setup Instructions

### Option 1: Local Storage (Default)

**Configuration in `.env`:**
```env
IMG_ENV=local
UPLOAD_PATH=./uploads
FILE_URL=http://localhost:5000
```

**How it works:**
- Images save hongi `./uploads` folder mein
- URL format: `http://localhost:5000/uploads/filename.jpg`
- Database mein relative path store hoga

**Benefits:**
- ✅ Quick setup - koi external service nahi chahiye
- ✅ Free - koi cost nahi
- ✅ Fast - local access
- ✅ Development ke liye perfect

**Drawbacks:**
- ❌ Server restart pe images lost nahi hongi but deployment pe manage karna padega
- ❌ Multiple servers pe sync issue
- ❌ Large files ke liye disk space chahiye

---

### Option 2: Cloudinary (Recommended for Production)

**Step 1: Cloudinary Account Setup**

1. [Cloudinary](https://cloudinary.com/) pe jaayein
2. Free account create karein (25 GB free storage + 25 GB bandwidth/month)
3. Dashboard se credentials note karein:
   - **Cloud Name**
   - **API Key**
   - **API Secret**

**Step 2: Configuration in `.env`**

```env
IMG_ENV=cloudinary

# Cloudinary credentials (from dashboard)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

**How it works:**
- Images directly Cloudinary CDN pe upload hongi
- URL format: `https://res.cloudinary.com/your-cloud-name/image/upload/v1234567890/delivery-app/filename.jpg`
- Database mein full Cloudinary URL store hoga
- Automatic image optimization & transformation

**Features:**
- ✅ CDN delivery - fast worldwide access
- ✅ Automatic image optimization
- ✅ Automatic backups
- ✅ Image transformations (resize, crop, format conversion)
- ✅ No disk space issues
- ✅ Multiple servers se access

**Image Settings:**
- Folder: `delivery-app` (Cloudinary dashboard mein organized rahega)
- Max size: 5MB (same as local)
- Allowed formats: jpg, jpeg, png, gif, webp, svg
- Auto transformation: Images larger than 1000x1000 resize hongi

---

## Usage Examples

Upload middleware automatically IMG_ENV ke basis pe kaam karega. Code change ki zaroorat nahi!

**Single File Upload:**
```javascript
router.post('/upload', upload.single('image'), (req, res) => {
  console.log(req.file.fileUrl);     // Full URL (local or cloudinary)
  console.log(req.file.urlForDB);    // Path to save in DB
  console.log(req.file.storageType); // 'local' or 'cloudinary'
});
```

**Multiple Files Upload:**
```javascript
router.post('/upload-multiple', upload.multiple('images', 5), (req, res) => {
  req.files.forEach(file => {
    console.log(file.fileUrl);
    console.log(file.urlForDB);
  });
});
```

---

## Testing

### Test Local Upload:
1. `.env` mein set karein: `IMG_ENV=local`
2. Server restart karein
3. Image upload karein (via Postman/Frontend)
4. Check karein: `backend/uploads` folder mein file honi chahiye

### Test Cloudinary Upload:
1. Cloudinary credentials `.env` mein add karein
2. `.env` mein set karein: `IMG_ENV=cloudinary`
3. Server restart karein
4. Image upload karein
5. Check karein: [Cloudinary Dashboard](https://cloudinary.com/console) → Media Library → `delivery-app` folder

---

## Migration Guide

### Local to Cloudinary Migration

Agar aap local se Cloudinary pe shift ho rahe hain:

1. **Existing images ko migrate karein:**
   ```javascript
   // Use Cloudinary's upload API to bulk upload existing images
   // Script example available in Cloudinary docs
   ```

2. **Update `.env`:**
   ```env
   IMG_ENV=cloudinary
   ```

3. **Database update:**
   - Old records: local paths hain
   - New records: Cloudinary URLs hongi
   - Frontend ko handle karna padega - either full URL ya relative path

**Best Practice:**
- Development: `IMG_ENV=local`
- Production: `IMG_ENV=cloudinary`

---

## Troubleshooting

### Issue: "Cloudinary configuration missing"
**Solution:**
- Check `.env` file mein `CLOUDINARY_*` variables set hain
- Server restart karein

### Issue: "File not uploading to Cloudinary"
**Solution:**
- Cloudinary credentials verify karein (login karke dashboard check karein)
- Network connection check karein
- Console logs check karein for errors

### Issue: "Images not showing after switching"
**Solution:**
- Frontend URL construct logic check karein
- Database mein path format verify karein
- For local: `/uploads/filename.jpg` chahiye
- For cloudinary: Full URL chahiye

---

## Cost Comparison

### Local Storage
- **Cost:** Free (only server disk space)
- **Bandwidth:** Server bandwidth se limited
- **Scalability:** Limited by disk space

### Cloudinary Free Tier
- **Storage:** 25 GB free
- **Bandwidth:** 25 GB/month free
- **Transformations:** 25,000/month free
- **Perfect for:** Small to medium applications

### Cloudinary Paid Plans
Start at $99/month for:
- 100 GB storage
- 100 GB bandwidth
- Unlimited transformations

---

## Security Notes

- ✅ `.env` file ko `.gitignore` mein add karein
- ✅ Cloudinary credentials ko publicly expose na karein
- ✅ File size limit: 5MB (adjust as needed)
- ✅ Only image files allowed
- ✅ Automatic file validation

---

## API Response Format

**Local Storage:**
```json
{
  "fileUrl": "http://localhost:5000/uploads/image-1234567890-123456789.jpg",
  "urlForDB": "uploads/image-1234567890-123456789.jpg",
  "storageType": "local"
}
```

**Cloudinary:**
```json
{
  "fileUrl": "https://res.cloudinary.com/demo/image/upload/v1234567890/delivery-app/image.jpg",
  "urlForDB": "https://res.cloudinary.com/demo/image/upload/v1234567890/delivery-app/image.jpg",
  "storageType": "cloudinary"
}
```

---

## Summary

- 🚀 **Development:** `IMG_ENV=local` (fast, free, simple)
- 🌐 **Production:** `IMG_ENV=cloudinary` (scalable, CDN, optimized)
- 🔄 **No code changes needed** - just update `.env`
- ✅ **Both modes fully tested and working**

For support: Check Cloudinary docs at https://cloudinary.com/documentation
