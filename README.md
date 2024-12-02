# **Clarky - Forklift Trading Marketplace**  

Clarky is a feature-rich, two-sided marketplace designed to connect buyers and sellers in the forklifts industry. Developed in two iterations, it focuses on delivering a seamless user experience, scalable architecture, and robust admin tools to manage the platform effectively.  

## **Overview**  
- **Tech Stack:** MERN (MongoDB, Express.js, React.js, Node.js)  
- **Current Version:** Remix.js for improved SEO  
- **Deployment:** Hosted on [Hostinger](https://calrky.site) with Nginx as a proxy.  
- **Monitoring & Tools:** Cloudflare for SSL and security, Hotjar, Tawk.to, and Google Analytics for user tracking.  

## **Features**  
### **Marketplace Functionality**  
- Search and filter ads by **province**, **status** (new/used), **type** (equipment, battery, charger, parts), and keywords.  
- View detailed ad pages, including:  
  - Ad photos  
  - Title and description  
  - Seller information and contact details  
  - Button to view other ads from the same seller  

### **User Management**  
- **Registration:**  
  - Form with fields: Name, Email, Phone, Password  
  - Email verification with a clickable link.  
- **Login/Password Reset:**  
  - Login with credentials or reset password via email link.  
- **Profile Options:**  
  - Update personal details: Photo, Bio, Phone, Name.  

### **Ad Management**  
- Create ads via a dedicated page.  
- Ads categorized by status:  
  - **Published**: Visible on the platform.  
  - **Under Review**: Pending admin approval.  
  - **Rejected**: With rejection reason from admin.  
- Edit or delete ads directly from the "My Ads" section.  

### **Driver Recruitment**  
- Users can apply to become drivers via a detailed form (Name, Experience, Location, Age, Phone, Description).  
- Drivers are listed publicly once approved, with filters for location and experience.  

### **Admin Dashboard**  
- **Statistics:** Overview of users, ads, and drivers by status.  
- **User Management:** View and delete users.  
- **Ad Management:** Approve, reject, or delete ads with filtering options.  
- **Driver Management:** Approve, reject, or delete driver applications.  

### **Multilingual Support**  
- Fully localized in **Arabic** and **English**.  

## **Technical Enhancements**  
- Transitioned from **React.js** to **Remix.js** to enhance SEO and performance.  
- Secured using **Cloudflare SSL** and proxied through **Nginx**.  
- Analytics and monitoring with **Hotjar**, **Tawk.to**, and **Google Analytics**.  

## **Links and Resources**  
- **First Version (React.js):** [GitHub Repository](https://github.com/ibrahim-embaby/clarky-forklift-trading-app)  
- **Second Version (Remix.js):**  
  - [Live Demo](https://calrky.site)  
  - [API Documentation](https://documenter.getpostman.com/view/17851950/2sAYBUDCGv)  
  - [Demo Video](https://bit.ly/4fOT57J)  

## **Roadmap**  
- Re-implement the **Notification Feature** from the first version into the second version.  
- Expand on driver recruitment features with more filters.  
- Further improve admin dashboard usability.  
