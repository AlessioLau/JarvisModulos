import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

function crc32(buf) {
  let table = [];
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      if (c & 1) c = 0xedb88320 ^ (c >>> 1);
      else c = c >>> 1;
    }
    table[n] = c >>> 0;
  }
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c = table[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

function makeChunk(type, data) {
  const len = data.length;
  const buf = Buffer.alloc(12 + len);
  buf.writeUInt32BE(len, 0);
  buf.write(type, 4, 4, 'ascii');
  data.copy(buf, 8);
  const typeAndData = buf.subarray(4, 8 + len);
  const crc = crc32(typeAndData);
  buf.writeUInt32BE(crc, 8 + len);
  return buf;
}

function generatePNG(size, outputPath) {
  // RGBA buffer (4 bytes per pixel + 1 filter byte per row)
  const rowLength = 1 + size * 4;
  const rawData = Buffer.alloc(rowLength * size);

  const cx = size / 2;
  const cy = size / 2;
  const rOuter = size * 0.45;
  const rInner = size * 0.28;

  for (let y = 0; y < size; y++) {
    const rowOffset = y * rowLength;
    rawData[rowOffset] = 0; // Filter: None

    for (let x = 0; x < size; x++) {
      const pxOffset = rowOffset + 1 + x * 4;
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Default dark background #0b0f19
      let r = 11, g = 15, b = 25, a = 255;

      // Rounded squircle container
      const nx = Math.abs(x - cx) / (size * 0.46);
      const ny = Math.abs(y - cy) / (size * 0.46);
      const inBox = Math.pow(nx, 4) + Math.pow(ny, 4) < 1.0;

      if (!inBox) {
        a = 0; // Transparent outside icon bounds
      } else {
        // Cyan reactor ring
        if (dist > rInner && dist < rOuter) {
          const factor = Math.sin((dist - rInner) / (rOuter - rInner) * Math.PI);
          r = Math.floor(6 + factor * 50);
          g = Math.floor(182 + factor * 70);
          b = Math.floor(212 + factor * 43);
        } else if (dist <= rInner) {
          // Inside core
          r = 15;
          g = 23;
          b = 42;
          // 'J' shape representation in center
          if (x > cx - size * 0.08 && x < cx + size * 0.08 && y > cy - size * 0.15 && y < cy + size * 0.1) {
            r = 34; g = 211; b = 238; // Neon cyan
          } else if (x > cx - size * 0.18 && x < cx + size * 0.08 && y >= cy + size * 0.05 && y < cy + size * 0.16) {
            r = 34; g = 211; b = 238;
          }
        }
      }

      rawData[pxOffset] = r;
      rawData[pxOffset + 1] = g;
      rawData[pxOffset + 2] = b;
      rawData[pxOffset + 3] = a;
    }
  }

  // Compress IDAT
  const compressed = zlib.deflateSync(rawData);

  // IHDR
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; // 8 bit
  ihdr[9] = 6; // Color type 6 (RGBA)
  ihdr[10] = 0; // Compression deflate
  ihdr[11] = 0; // Filter
  ihdr[12] = 0; // No interlace

  const signature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  const ihdrChunk = makeChunk('IHDR', ihdr);
  const idatChunk = makeChunk('IDAT', compressed);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  const png = Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
  fs.writeFileSync(outputPath, png);
  console.log(`Generated ${outputPath} (${size}x${size})`);
}

generatePNG(192, path.resolve('public', 'icon-192.png'));
generatePNG(512, path.resolve('public', 'icon-512.png'));
generatePNG(180, path.resolve('public', 'apple-touch-icon.png'));
