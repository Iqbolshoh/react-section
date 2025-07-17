# Templates.uz - Mobile Website Builder

A modern, mobile-first website builder that allows users to create professional websites using drag-and-drop components.

## 🚀 Features

- **Mobile-First Design**: Optimized for mobile devices with responsive layouts
- **Drag & Drop Builder**: Intuitive visual editor with sortable sections
- **Professional Templates**: Pre-built sections for headers, heroes, services, pricing, etc.
- **Theme Customization**: Multiple color schemes and font combinations
- **Real-time Preview**: See changes instantly as you build
- **SEO Optimization**: Built-in SEO features and meta tag management
- **Export Functionality**: Export websites as standalone HTML files
- **Optimized LocalStorage**: Database-ready data persistence with backup/restore capabilities

## 🏗️ Architecture

### Frontend Stack
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **React Router** for navigation
- **@dnd-kit** for drag and drop functionality

### Data Management
- **Context API** for state management
- **Optimized LocalStorage** for data persistence (database-ready structure)
- **Migration Helper** for seamless database transition

## 📁 Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── sections/        # Website section components
│   │   ├── headers/     # Header components
│   │   ├── heroes/      # Hero section components
│   │   ├── about/       # About section components
│   │   ├── services/    # Services section components
│   │   ├── features/    # Features section components
│   │   ├── pricing/     # Pricing section components
│   │   ├── testimonials/# Testimonial components
│   │   ├── portfolio/   # Portfolio section components
│   │   ├── contact/     # Contact form components
│   │   ├── footers/     # Footer components
│   │   ├── cta/         # Call-to-action components
│   │   └── blog/        # Blog section components
│   ├── AddSectionButton.tsx
│   ├── IconSelector.tsx
│   ├── SectionControls.tsx
│   ├── SectionRenderer.tsx
│   ├── SectionSelector.tsx
│   └── ThemeCustomizer.tsx
├── contexts/            # React Context providers
│   ├── ProjectContext.tsx
│   └── ThemeContext.tsx
├── data/               # Static data and templates
│   ├── improvedSectionTemplates.ts
│   └── sectionTemplates.ts
├── hooks/              # Custom React hooks
│   └── useOptimizedStorage.ts
├── pages/              # Main application pages
│   ├── Dashboard.tsx   # Project management dashboard
│   ├── Editor.tsx      # Visual website editor
│   ├── Preview.tsx     # Website preview mode
│   ├── Profile.tsx     # User profile management
│   ├── Billing.tsx     # Subscription and billing
│   ├── Settings.tsx    # Application settings
│   └── Team.tsx        # Team collaboration (Pro feature)
├── types/              # TypeScript type definitions
│   ├── index.ts
│   └── storage.ts
├── utils/              # Utility functions
│   ├── helpers.ts
│   ├── htmlExporter.ts
│   ├── migrationHelper.ts
│   ├── optimizedStorage.ts
│   └── storage.ts
└── App.tsx             # Main application component
```

## 💾 Optimized LocalStorage Architecture (Database-Ready)

### 🎯 Design Philosophy

The LocalStorage system is architected to mirror a relational database structure, making future database migration seamless. Every data structure, relationship, and operation is designed with database best practices in mind.

### 🗂️ Storage Structure (Database Table Equivalent)

The storage system is organized like database tables with proper relationships and foreign keys:

```typescript
interface OptimizedStorageData {
  // Users table equivalent
  user: {
    id: string;                    // Primary key
    profile: UserProfile;          // User profile data
    preferences: UserPreferences;  // User settings
    subscription: UserSubscription;// Billing information
    createdAt: Date;              // Timestamp
    lastLoginAt: Date;            // Activity tracking
  };
  
  // Projects table equivalent (with foreign key to user)
  projects: {
    [projectId: string]: ProjectData; // Key-value for O(1) access
  };
  
  // Templates tables equivalent
  templates: {
    sections: { [templateId: string]: SectionTemplate };
    themes: { [themeId: string]: ThemeConfig };
  };
  
  // Settings table equivalent
  settings: {
    version: string;
    lastSync: Date;
    features: FeatureFlags;
  };
  
  // Analytics tables equivalent
  analytics: {
    projectStats: ProjectStats[];
    usageMetrics: UsageMetrics;
  };
}
```

### 🔑 LocalStorage Keys Structure

The system uses prefixed keys to organize data like database tables:

```typescript
const STORAGE_KEYS = {
  USER: 'templates_uz_user',           // User profile and preferences
  PROJECTS: 'templates_uz_projects',   // All user projects (like projects table)
  TEMPLATES: 'templates_uz_templates', // Section templates and themes
  SETTINGS: 'templates_uz_settings',   // App settings and feature flags
  ANALYTICS: 'templates_uz_analytics', // Usage statistics and metrics
  CACHE: 'templates_uz_cache',         // Temporary cached data with TTL
};
```

### 📊 Data Relationships (Database Foreign Keys)

```typescript
// Projects belong to User (foreign key relationship)
interface ProjectData {
  id: string;              // Primary key
  userId: string;          // Foreign key to user.id
  name: string;
  websiteUrl: string;      // Unique constraint
  sections: SectionInstance[]; // One-to-many relationship
  metadata: {
    version: string;
    collaborators: string[]; // Many-to-many relationship (user IDs)
    tags: string[];
    isTemplate: boolean;
    logoFileName?: string;
    faviconFileName?: string;
  };
  seo: {
    title?: string;
    description?: string;
    keywords: string[];
    ogImage?: string;
    customMeta: Record<string, string>;
  };
  analytics: {
    views: number;
    lastViewed?: Date;
    performance: {
      loadTime?: number;
      sizeKB?: number;
      lighthouse?: {
        performance: number;
        accessibility: number;
        bestPractices: number;
        seo: number;
      };
    };
  };
  deployment: {
    status: 'draft' | 'published' | 'archived';
    publishedUrl?: string;
    customDomain?: string;
    ssl: boolean;
    lastDeployed?: Date;
    deploymentHistory: DeploymentRecord[];
  };
  // ... other fields
}

// Sections belong to Projects (foreign key relationship)
interface SectionInstance {
  id: string;              // Primary key
  projectId: string;       // Foreign key to project.id (implicit)
  templateId: string;      // Foreign key to section_templates.id
  order: number;           // For ordering sections
  data: Record<string, any>; // JSON data
  createdAt: Date;
  updatedAt: Date;
}
```

### 🛠️ Storage Operations (CRUD Operations)

The storage manager provides database-like operations:

```typescript
// CREATE operations
optimizedStorage.saveProject(project);        // INSERT INTO projects
optimizedStorage.saveUser(user);              // INSERT INTO users
optimizedStorage.saveSectionTemplate(template); // INSERT INTO section_templates

// READ operations
optimizedStorage.getAllProjects();            // SELECT * FROM projects
optimizedStorage.getProject(id);              // SELECT * FROM projects WHERE id = ?
optimizedStorage.getUser();                   // SELECT * FROM users WHERE id = current_user

// UPDATE operations
optimizedStorage.saveProject(updatedProject); // UPDATE projects SET ... WHERE id = ?
optimizedStorage.saveUserPreferences(prefs);  // UPDATE users SET preferences = ? WHERE id = ?

// DELETE operations
optimizedStorage.deleteProject(id);           // DELETE FROM projects WHERE id = ?
```

### 🔄 Data Consistency and Integrity

The system ensures data consistency like a database:

1. **Atomic Operations**: Each save operation is atomic
2. **Data Validation**: Input validation before saving
3. **Referential Integrity**: Maintains relationships between entities
4. **Automatic Timestamps**: CreatedAt and UpdatedAt fields
5. **Unique Constraints**: Prevents duplicate website URLs
6. **Foreign Key Simulation**: Maintains parent-child relationships

### 📈 Storage Health Monitoring

```typescript
// Monitor storage like database performance metrics
const health = optimizedStorage.getStorageHealth();
// Returns: {
//   totalSize: number,        // Total storage used in bytes
//   keyCount: number,         // Number of storage keys
//   largestKey: string,       // Key using most space
//   oldestData: Date,         // Oldest data timestamp
//   recommendations: string[] // Optimization suggestions
// }
```

### 🧹 Data Cleanup and Maintenance

```typescript
// Clean old data (like database maintenance)
optimizedStorage.cleanupOldData(30); // Remove data older than 30 days
optimizedStorage.clearCache();       // Clear expired cache entries
```

## 🚀 Database Migration Plan

### Current LocalStorage → PostgreSQL Mapping

#### Core Tables

**users**
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    avatar TEXT,
    company VARCHAR(255),
    website VARCHAR(255),
    bio TEXT,
    preferences JSONB DEFAULT '{}',
    subscription JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**projects**
```sql
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    website_url VARCHAR(255) UNIQUE NOT NULL,
    category VARCHAR(100) NOT NULL,
    seo_keywords JSONB DEFAULT '[]',
    logo TEXT, -- Base64 encoded image data
    favicon TEXT, -- Base64 encoded image data
    theme_id VARCHAR(255) NOT NULL,
    is_published BOOLEAN DEFAULT FALSE,
    published_url TEXT,
    custom_domain VARCHAR(255),
    ssl_enabled BOOLEAN DEFAULT FALSE,
    
    -- Metadata
    version VARCHAR(50) DEFAULT '1.0.0',
    tags JSONB DEFAULT '[]',
    is_template BOOLEAN DEFAULT FALSE,
    logo_filename VARCHAR(255), -- Original filename
    favicon_filename VARCHAR(255), -- Original filename
    
    -- SEO
    seo_title VARCHAR(255),
    seo_description TEXT,
    og_image TEXT,
    custom_meta JSONB DEFAULT '{}',
    
    -- Analytics
    view_count INTEGER DEFAULT 0,
    last_viewed_at TIMESTAMP WITH TIME ZONE,
    performance_score DECIMAL(3,2),
    load_time_ms INTEGER,
    size_kb INTEGER,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    published_at TIMESTAMP WITH TIME ZONE,
    last_backup_at TIMESTAMP WITH TIME ZONE
);
```

**sections**
```sql
CREATE TABLE sections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    template_id VARCHAR(255) NOT NULL,
    order_index INTEGER NOT NULL,
    data JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**section_templates**
```sql
CREATE TABLE section_templates (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    type VARCHAR(100) NOT NULL,
    description TEXT,
    thumbnail TEXT,
    icon VARCHAR(50),
    tags JSONB DEFAULT '[]',
    default_content JSONB DEFAULT '{}',
    is_premium BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 🔄 Migration Process (LocalStorage → Database)

1. **Export Current Data**:
   ```typescript
   const data = optimizedStorage.exportAllData();
   // Generates migration-ready JSON with all relationships
   ```

2. **Create Database Schema**:
   ```sql
   -- Run the provided SQL schema to create all tables
   -- Includes indexes, constraints, and triggers
   ```

3. **Transform and Import**:
   ```typescript
   const migrationData = migrationHelper.transformForDatabase();
   // Converts LocalStorage structure to database format
   ```

4. **Validate Migration**:
   ```typescript
   const validation = migrationHelper.validateMigrationData();
   // Ensures data integrity and relationships
   ```

### 🎯 Key Benefits of Current Structure

1. **Database-Ready**: Direct mapping to SQL tables
2. **Referential Integrity**: Maintains relationships between entities
3. **ACID-like Properties**: Atomic operations and consistency
4. **Scalable**: Easy to add new fields and relationships
5. **Debuggable**: Clear structure for troubleshooting
6. **Migration-Friendly**: Smooth transition to any database

## 🔍 LocalStorage Debugging & Development

### Inspecting Current Data

To inspect current LocalStorage data in browser console:

```javascript
// View all storage keys
Object.keys(localStorage).filter(key => key.startsWith('templates_uz_'));

// View projects data
JSON.parse(localStorage.getItem('templates_uz_projects') || '{}');

// View user data
JSON.parse(localStorage.getItem('templates_uz_user') || 'null');

// View storage health
const health = optimizedStorage.getStorageHealth();
console.log('Storage Health:', health);

// Clear all data (for testing)
Object.keys(localStorage)
  .filter(key => key.startsWith('templates_uz_'))
  .forEach(key => localStorage.removeItem(key));
```

### Development Tools

```typescript
// Export all data for backup
const backup = optimizedStorage.exportAllData();
console.log('Backup data:', backup);

// Import data from backup
const success = optimizedStorage.importAllData(backupJson);

// Monitor storage usage
const usage = optimizedStorage.getStorageHealth();
console.log(`Storage: ${usage.totalSize} bytes, ${usage.keyCount} keys`);
```

### Migration Helper Usage

```typescript
import { migrationHelper } from './utils/migrationHelper';

// Generate database schema
const schema = migrationHelper.generateDatabaseSchema();

// Export migration-ready data
const migrationData = migrationHelper.exportMigrationData();

// Validate data before migration
const validation = migrationHelper.validateMigrationData();

if (validation.isValid) {
  // Proceed with migration
  console.log('Data is ready for migration');
} else {
  console.log('Validation errors:', validation.errors);
}
```

## 🎨 Website Creation Process

### Enhanced Website Creation Form

When creating a new website, users provide:

1. **Website Name**: Display name for the project
2. **Website URL**: Unique identifier (validated for availability)
3. **Category**: Business type selection with icons and descriptions
4. **SEO Keywords**: Comma-separated keywords for SEO optimization
5. **Logo Upload**: File upload with preview and validation
6. **Favicon Upload**: File upload with preview and validation

### File Upload System

The application includes a robust file upload system for logos and favicons:

#### Logo Upload
- **Supported Formats**: PNG, SVG, JPG, JPEG
- **File Size Limit**: 5MB maximum
- **Storage**: Base64 encoded in LocalStorage (database-ready)
- **Auto-Integration**: Automatically appears in header, footer, and relevant sections
- **Preview**: Real-time preview with remove functionality

#### Favicon Upload
- **Supported Formats**: ICO, PNG
- **Recommended Size**: 16x16 or 32x32 pixels
- **File Size Limit**: 1MB maximum
- **Storage**: Base64 encoded for browser tab display
- **Preview**: Real-time preview with remove functionality

#### Technical Implementation
```typescript
// File to Base64 conversion for storage
const convertFileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

// Storage structure for uploaded files
interface ProjectData {
  logo: string; // Base64 encoded image data
  favicon: string; // Base64 encoded image data
  metadata: {
    logoFileName?: string; // Original filename for reference
    faviconFileName?: string; // Original filename for reference
  };
}
```

### Category Options

- **Business**: Corporate websites, agencies, consulting
- **Personal**: Personal blogs, portfolios, resumes
- **Portfolio**: Creative portfolios, showcases
- **E-commerce**: Online stores, marketplaces
- **Education**: Schools, courses, learning platforms
- **Photography**: Photo galleries, studios
- **Music**: Musicians, bands, music studios
- **Gaming**: Gaming communities, esports
- **Restaurant**: Restaurants, cafes, food services
- **Automotive**: Car dealerships, auto services
- **Real Estate**: Property listings, real estate agencies

### URL Validation

- Real-time availability checking
- Format validation (alphanumeric, hyphens, underscores only)
- Length validation (3-50 characters)
- Duplicate prevention
- Visual feedback (success/error indicators)

## 🔧 Development Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd templates-uz
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```

4. Open browser to `http://localhost:5173`

### File Upload Development Notes

When working with file uploads in development:

1. **File Size Limits**: Adjust limits in `handleLogoUpload` and `handleFaviconUpload` functions
2. **Supported Formats**: Modify `accept` attribute and validation logic
3. **Storage Optimization**: Consider implementing image compression for production
4. **Database Migration**: Base64 data is ready for BLOB/TEXT columns in database

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 📱 Mobile-First Approach

The application is built with mobile-first principles:

- **Responsive Design**: All components adapt to different screen sizes
- **Touch-Friendly**: Large touch targets and intuitive gestures
- **Performance Optimized**: Fast loading and smooth animations
- **Progressive Enhancement**: Works on all devices, enhanced on larger screens

## 🎯 Key Features Explained

### Section Management
- **Drag & Drop Reordering**: Sections can be reordered using drag and drop
- **Visual Controls**: Hover controls for editing, duplicating, and deleting
- **Add Section Buttons**: Context-aware buttons to add sections above/below
- **Real-time Editing**: Inline editing with immediate visual feedback

### Theme System
- **Multiple Color Schemes**: 8+ pre-built color themes
- **Font Collections**: Professional font combinations
- **Live Preview**: See theme changes instantly
- **CSS Variables**: Efficient theme switching using CSS custom properties

### Export System
- **Complete HTML Export**: Generates standalone HTML files
- **Embedded Styles**: All styles included inline for portability
- **Optimized Output**: Clean, production-ready code
- **Asset Handling**: Proper handling of images and external resources

## 🔄 Data Flow

1. **User Interaction**: User interacts with components in the editor
2. **Context Updates**: Changes are propagated through React Context
3. **Storage Sync**: Data is automatically saved to optimized LocalStorage
4. **Real-time Preview**: Changes are immediately visible in preview mode
5. **Export Generation**: HTML is generated on-demand for export

## 🚀 Performance Optimizations

- **Code Splitting**: Dynamic imports for better loading performance
- **Memoization**: React.memo and useMemo for expensive operations
- **Optimized Re-renders**: Careful state management to minimize re-renders
- **Lazy Loading**: Components and images loaded on demand
- **Efficient Storage**: Optimized data structures and serialization

## 🔐 Data Security

- **Local Storage**: All data stored locally in user's browser
- **No External Dependencies**: No data sent to external servers
- **Export Control**: Users have full control over their data
- **Privacy First**: No tracking or analytics collection

## 🛠️ Customization

### Adding New Section Types

1. Create component in `src/components/sections/[category]/`
2. Add template definition in `src/data/improvedSectionTemplates.ts`
3. Register in `src/components/SectionRenderer.tsx`
4. Add to category mapping

### Adding New Themes

1. Define theme in `src/contexts/ThemeContext.tsx`
2. Add to `colorCollections` array
3. Include color palette and typography settings

### Extending Storage

1. Update interfaces in `src/types/storage.ts`
2. Modify storage methods in `src/utils/optimizedStorage.ts`
3. Update migration helper for database compatibility

## 📊 Analytics & Monitoring

The application includes built-in analytics for:

- **Project Statistics**: Section counts, modification times
- **Usage Metrics**: Storage usage, session tracking
- **Performance Monitoring**: Load times, storage health
- **User Behavior**: Feature usage, error tracking

## 🔮 Future Enhancements

### Planned Features
- **Real-time Collaboration**: Multi-user editing capabilities
- **Advanced SEO Tools**: Meta tag optimization, sitemap generation
- **E-commerce Integration**: Shopping cart and payment processing
- **Custom Code Injection**: HTML/CSS/JS customization
- **Template Marketplace**: Community-driven template sharing
- **Multi-language Support**: Internationalization features

### Database Migration Benefits
- **Scalability**: Handle thousands of users and projects
- **Collaboration**: Real-time multi-user editing
- **Backup & Sync**: Automatic cloud backup and device sync
- **Advanced Analytics**: Detailed usage and performance metrics
- **Template Sharing**: Community template marketplace
- **Version Control**: Project history and rollback capabilities

## 📞 Support

For questions, issues, or contributions, please refer to the project documentation or contact the development team.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.