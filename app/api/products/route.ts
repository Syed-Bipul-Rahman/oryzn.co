import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Product from '@/lib/models/Product';
import { getSession } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

// GET all products
export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const limit = parseInt(searchParams.get('limit') || '0');

    let query: Record<string, unknown> = {};

    if (category) {
      query.category = category;
    }

    if (search) {
      query.$text = { $search: search };
    }

    let productsQuery = Product.find(query).sort({ createdAt: -1 });

    if (limit > 0) {
      productsQuery = productsQuery.limit(limit);
    }

    const products = await productsQuery.lean();

    // Transform _id to id for frontend compatibility
    const transformedProducts = products.map((product) => ({
      ...product,
      id: product._id.toString(),
      _id: undefined,
    }));

    return NextResponse.json(transformedProducts);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

// POST create new product (protected)
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectToDatabase();

    const data = await request.json();

    // Generate slug if not provided
    if (!data.slug) {
      data.slug = data.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }

    const product = await Product.create(data);

    // Revalidate pages
    revalidatePath('/');
    revalidatePath('/sitemap.xml');

    return NextResponse.json(
      {
        ...product.toObject(),
        id: product._id.toString(),
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error('Error creating product:', error);

    // Handle duplicate slug error
    if (error && typeof error === 'object' && 'code' in error && error.code === 11000) {
      return NextResponse.json(
        { error: 'A product with this slug already exists' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}
