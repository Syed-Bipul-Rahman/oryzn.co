import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

// Explicitly configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'drguqwqgd',
  api_key: process.env.CLOUDINARY_API_KEY || '171748817748189',
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: NextRequest) {
  try {
    // Check if Cloudinary is configured
    if (!process.env.CLOUDINARY_API_SECRET && !process.env.CLOUDINARY_URL) {
      console.error('Cloudinary not configured. Missing CLOUDINARY_API_SECRET or CLOUDINARY_URL');
      return NextResponse.json(
        { error: 'Image upload service not configured' },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const files = formData.getAll('files') as File[];

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'No files uploaded' },
        { status: 400 }
      );
    }

    const uploadedUrls: string[] = [];

    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        return NextResponse.json(
          { error: 'Only image files are allowed' },
          { status: 400 }
        );
      }

      // Convert file to base64
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const base64 = `data:${file.type};base64,${buffer.toString('base64')}`;

      // Upload to Cloudinary
      const result = await cloudinary.uploader.upload(base64, {
        folder: 'products',
        resource_type: 'image',
      });

      uploadedUrls.push(result.secure_url);
    }

    return NextResponse.json({
      success: true,
      urls: uploadedUrls
    });
  } catch (error) {
    console.error('Upload error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: `Failed to upload: ${errorMessage}` },
      { status: 500 }
    );
  }
}
