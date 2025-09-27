# PDF Export Feature Guide

## Overview
The PDF export feature allows administrators to generate comprehensive reports of all bookings in PDF format. This feature includes filtering options and generates a professional-looking report with summary statistics.

## API Endpoint
```
GET /booking/export-pdf
```

## Authentication
- **Required**: Admin role only
- **Authorization**: Bearer token in header

## Query Parameters (Optional)
All parameters are optional and can be used to filter the bookings:

- `status`: Filter by booking status (`confirmed`, `pending`, `cancelled`)
- `date`: Filter by specific date (format: `YYYY-MM-DD`)
- `renterPhone`: Search by renter phone number (partial match)
- `renterName`: Search by renter name (partial match)
- `sort`: Sort order (default: `-createdAt` for newest first)

## Example Usage

### Export All Bookings
```bash
GET /booking/export-pdf
Authorization: Bearer <admin_token>
```

### Export Confirmed Bookings Only
```bash
GET /booking/export-pdf?status=confirmed
Authorization: Bearer <admin_token>
```

### Export Bookings for Specific Date
```bash
GET /booking/export-pdf?date=2025-01-15
Authorization: Bearer <admin_token>
```

### Export Bookings with Multiple Filters
```bash
GET /booking/export-pdf?status=confirmed&date=2025-01-15&renterName=ahmad
Authorization: Bearer <admin_token>
```

## Response
- **Content-Type**: `application/pdf`
- **Content-Disposition**: `attachment; filename="bookings-report-YYYY-MM-DD.pdf"`
- **Body**: PDF file binary data

## PDF Report Contents

### Header Section
- Report title with soccer field emoji
- Generation date
- Total number of bookings

### Summary Section
- Total bookings count
- Total revenue (sum of all booking prices)
- Count by status (confirmed, pending, cancelled)

### Detailed Table
- Booking ID (last 8 characters)
- Renter information (name, phone, email)
- Date and time details
- Duration and pricing
- Status with color-coded badges
- Comments
- Creation date

### Footer
- System information
- Contact details

## Features
- **Professional Design**: Clean, modern layout with proper styling
- **Color-coded Status**: Visual status indicators for easy reading
- **Responsive Layout**: Optimized for A4 paper format
- **Comprehensive Data**: All booking information included
- **Filtering Support**: Same filtering options as the regular API
- **Automatic Filename**: Date-stamped filename for easy organization

## Error Handling
- Returns 404 if no bookings match the criteria
- Returns 403 if user is not an admin
- Returns 500 for server errors (e.g., PDF generation issues)

## Technical Details
- Uses Puppeteer for PDF generation
- HTML template with embedded CSS
- A4 format with proper margins
- Optimized for printing and digital viewing

