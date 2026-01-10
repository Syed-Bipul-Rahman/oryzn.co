import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Product from '@/lib/models/Product';
import { getSession } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import mongoose from 'mongoose';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET single product by ID or slug
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    await connectToDatabase();

    const { id } = await params;

    let product;

    // Check if id is a valid MongoDB ObjectId
    if (mongoose.Types.ObjectId.isValid(id)) {
      product = await Product.findById(id).lean();
    }

    // If not found by ID, try finding by slug
    if (!product) {
      product = await Product.findOne({ slug: id }).lean();
    }

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ...product,
      id: product._id.toString(),
      _id: undefined,
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}

// PUT update product (protected)
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectToDatabase();

    const { id } = await params;
    const data = await request.json();

    // Remove id from data if present
    delete data.id;
    delete data._id;

    const product = await Product.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true, runValidators: true }
    ).lean();

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Revalidate pages
    revalidatePath('/');
    revalidatePath(`/product/${product.slug}`);
    revalidatePath('/sitemap.xml');

    return NextResponse.json({
      ...product,
      id: product._id.toString(),
      _id: undefined,
    });
  } catch (error: unknown) {
    console.error('Error updating product:', error);

    // Handle duplicate slug error
    if (error && typeof error === 'object' && 'code' in error && error.code === 11000) {
      return NextResponse.json(
        { error: 'A product with this slug already exists' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    );
  }
}

// DELETE product (protected)
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectToDatabase();

    const { id } = await params;

    const product = await Product.findByIdAndDelete(id).lean();

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Revalidate pages
    revalidatePath('/');
    revalidatePath('/sitemap.xml');

    return NextResponse.json({ success: true, message: 'Product deleted' });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    );
  }
}
