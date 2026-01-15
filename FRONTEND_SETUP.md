# Frontend Admin Panel Setup - Content Moderation

## ✅ What's Been Added

### 1. **New Admin Page: Content Moderation**
Location: `src/pages/ContentModeration/ContentModeration.jsx`

### 2. **Updated Files:**
- ✅ `src/config/api.js` - Added POSTS endpoints
- ✅ `src/App.jsx` - Added `/content-moderation` route
- ✅ `src/components/Sidebar.jsx` - Added "Content Moderation" menu item

---

## 🎯 Features Implemented

### **Content Moderation Dashboard**

#### **Stats Overview (Top Cards)**
- Total Posts
- Pending Reports
- Resolved Reports
- Blocked Relations

#### **Tab 1: Reported Content**
Shows all reported posts with:
- Report status (pending/resolved)
- Reporter details (name, email)
- Post author details (name, email)
- Report reason
- Post content
- Action buttons:
  - **Delete Post** - Removes the post
  - **Block User** - Blocks the post author

#### **Tab 2: Blocked Users**
Shows all user blocking relationships:
- Blocker information
- Blocked user information
- Block date

---

## 🚀 How to Access

1. **Login to Admin Panel**
2. **Click "Content Moderation"** in the sidebar
3. **View Reports** - See all reported content
4. **Take Action** - Delete posts or block users
5. **Monitor Blocked Users** - View blocking relationships

---

## 📱 Page Layout

```
┌─────────────────────────────────────────────────┐
│  Content Moderation                             │
├─────────────────────────────────────────────────┤
│  [Total Posts] [Pending] [Resolved] [Blocked]   │
├─────────────────────────────────────────────────┤
│  [Reported Content Tab] [Blocked Users Tab]     │
├─────────────────────────────────────────────────┤
│                                                  │
│  Report Cards / Blocked Users Table             │
│                                                  │
│  - Reporter Info                                 │
│  - Post Author Info                              │
│  - Reason                                        │
│  - Post Content                                  │
│  - [Delete Post] [Block User] buttons           │
│                                                  │
└─────────────────────────────────────────────────┘
```

---

## 🔧 API Integration

The page automatically fetches data from:

```javascript
// Get all reports with details
GET /api/posts/admin/reports

// Get blocked users
GET /api/posts/admin/blocked-users

// Get dashboard stats
GET /api/posts/admin/stats

// Delete a post
DELETE /api/posts/admin/posts/:postId

// Block a user
POST /api/posts/admin/users/:userId/block

// Unblock a user
DELETE /api/posts/admin/users/:userId/unblock
```

---

## 🎨 Design Features

- ✅ Responsive design (mobile & desktop)
- ✅ Poppins font family
- ✅ Color scheme matches existing admin panel
- ✅ Loading states
- ✅ Confirmation dialogs for actions
- ✅ Status badges (pending/resolved)
- ✅ Hover effects
- ✅ Clean card-based layout

---

## 📝 Usage Example

### Admin Workflow:

1. **Admin sees notification** - "5 Pending Reports"

2. **Opens Content Moderation page**
   - Views stats dashboard
   - Clicks "Reported Content" tab

3. **Reviews a report**
   - Sees reporter: John Doe (john@example.com)
   - Sees post author: Jane Smith (jane@example.com)
   - Reason: "Spam content"
   - Post content: "Buy now! Click here..."

4. **Takes action**
   - Clicks "Delete Post" → Post removed
   - Clicks "Block User" → User blocked from platform
   - Report automatically marked as "resolved"

5. **Checks Blocked Users tab**
   - Views all blocking relationships
   - Monitors platform health

---

## 🔐 Security Notes

**Important:** Add authentication middleware to verify admin access:

```javascript
// In your API routes
const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};
```

---

## 🎯 Next Steps

1. **Test the page** - Navigate to `/content-moderation`
2. **Verify API connection** - Check browser console for errors
3. **Test actions** - Try deleting posts and blocking users
4. **Add authentication** - Protect admin routes
5. **Customize styling** - Adjust colors/layout as needed

---

## 📦 Dependencies

All dependencies are already in your project:
- React
- React Router
- Lucide React (icons)
- Tailwind CSS

No additional packages needed! ✅

---

## 🐛 Troubleshooting

### Issue: "Cannot fetch reports"
**Solution:** Check API_BASE_URL in `src/config/api.js`

### Issue: "404 Not Found"
**Solution:** Ensure backend server is running and routes are registered

### Issue: "CORS Error"
**Solution:** Check CORS configuration in backend `server.js`

---

## ✨ Features Summary

✅ View all reported posts with full details  
✅ View reporter and author information  
✅ Delete reported posts  
✅ Block users from platform  
✅ View all blocked user relationships  
✅ Dashboard statistics  
✅ Responsive design  
✅ Real-time data refresh  
✅ Confirmation dialogs  
✅ Status indicators  

**The admin panel is ready to use!** 🚀
