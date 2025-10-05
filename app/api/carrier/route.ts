import { NextResponse } from 'next/server';
import { getSocketServer } from '../../../lib/socket-instance';

// Simple in-memory store for carrier data
const carriers: any[] = [];

export async function POST(request: Request) {
  try {
    const data = await request.json();
    console.log('Received carrier data:', data);

    // Store the carrier data in memory
    carriers.push(data);

    // Get the Socket.io server instance
    const io = getSocketServer();

    if (io) {
      // Emit the newCarrierRequest event to all connected clients
      io.emit('newCarrierRequest', data);
      console.log('Emitted newCarrierRequest event with data:', data);
    } else {
      console.error('Socket.io server not initialized');
    }

    return NextResponse.json({ message: 'Carrier data received and event emitted', data }, { status: 201 });
  } catch (error) {
    console.error('Error processing carrier data:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}