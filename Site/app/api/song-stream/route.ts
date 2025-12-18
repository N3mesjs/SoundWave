import { type NextRequest } from 'next/server'

import {createWriteStream} from 'node:fs';
import ytdl from 'ytdl-core';
import { Readable } from 'node:stream';

export async function GET(request: NextRequest) {
    try {
      const searchParams = request.nextUrl.searchParams;
      const query = searchParams.get('query');
      
        const nodejsStream = ytdl('http://www.youtube.com/watch?v=aqz-KE-bpKQ', {
            filter: 'audioonly',
            quality: 'highestaudio',
        })
        nodejsStream.on('error', (err) => {
            console.error('Error downloading audio:', err);
            return Response.json(
                { message: "Error downloading audio" },
                { status: 500,
                  headers: {
                    "Content-Type": "application/json"
                  }
                }
              )
        });
        const webStream = Readable.toWeb(nodejsStream) as ReadableStream;

        return new Response(webStream, {
          headers: {
            "Content-Type": "audio/mpeg",
          },
          status: 200
        })
    } catch (error) {
        return Response.json(
            { message: "Internal Server Error" },
            { 
              status: 500,
              headers: {
                "Content-Type": "application/json"
              }
            }
          )
    }
}