import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const name       = searchParams.get('name')       || 'LaunchLog'
    const tagline    = searchParams.get('tagline')    || 'Discover what\'s next'
    const emoji      = searchParams.get('emoji')      || '🚀'
    const supporters = searchParams.get('supporters') || '0'
    const category   = searchParams.get('category')  || ''

    return new ImageResponse(
      (
        <div
          style={{
            width: '1200px',
            height: '630px',
            background: '#fdf8f2',
            display: 'flex',
            flexDirection: 'column',
            padding: '60px',
            fontFamily: 'Georgia, serif',
          }}
        >
          {/* Top bar */}
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '48px' }}>
            <span style={{ fontSize: '28px', fontWeight: '700', color: '#2d2420' }}>
              Launch
            </span>
            <span style={{ fontSize: '28px', fontWeight: '700', color: '#ff7b5c' }}>
              Log
            </span>
          </div>

          {/* Card */}
          <div
            style={{
              background: 'white',
              borderRadius: '24px',
              border: '1.5px solid #ecddd4',
              padding: '48px',
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 20px 60px rgba(45,36,32,0.12)',
            }}
          >
            {/* Logo + name row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '24px' }}>
              <div
                style={{
                  width: '80px',
                  height: '80px',
                  background: '#f5f5f5',
                  borderRadius: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '42px',
                }}
              >
                {emoji}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ fontSize: '48px', fontWeight: '700', color: '#2d2420', lineHeight: 1.1 }}>
                  {name}
                </div>
                {category ? (
                  <div
                    style={{
                      display: 'inline-block',
                      background: '#f5f0ff',
                      color: '#7c5cbf',
                      fontSize: '16px',
                      fontWeight: '600',
                      padding: '4px 14px',
                      borderRadius: '99px',
                      marginTop: '10px',
                      width: 'fit-content',
                    }}
                  >
                    {category}
                  </div>
                ) : null}
              </div>
            </div>

            {/* Tagline */}
            <div
              style={{
                fontSize: '28px',
                color: '#7a6e68',
                lineHeight: 1.4,
                flex: 1,
                fontStyle: 'italic',
              }}
            >
              "{tagline}"
            </div>

            {/* Footer row */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: '24px',
              }}
            >
              {parseInt(supporters) > 0 ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '28px' }}>🚀</span>
                  <span style={{ fontSize: '22px', fontWeight: '700', color: '#ff7b5c' }}>
                    {parseInt(supporters).toLocaleString()} supporters
                  </span>
                </div>
              ) : (
                <div style={{ fontSize: '20px', color: '#7a6e68' }}>
                  Early-stage startup discovery
                </div>
              )}
              <div
                style={{
                  background: '#ff7b5c',
                  color: 'white',
                  padding: '14px 28px',
                  borderRadius: '99px',
                  fontSize: '18px',
                  fontWeight: '600',
                }}
              >
                Discover on LaunchLog →
              </div>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    )
  } catch (error) {
    // Return a simple fallback image if anything goes wrong
    return new ImageResponse(
      (
        <div
          style={{
            width: '1200px',
            height: '630px',
            background: '#fdf8f2',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'Georgia, serif',
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '48px', fontWeight: '700', color: '#2d2420' }}>
              Launch<span style={{ color: '#ff7b5c' }}>Log</span>
            </div>
            <div style={{ fontSize: '24px', color: '#7a6e68', marginTop: '16px' }}>
              Discover what's next
            </div>
          </div>
        </div>
      ),
      { width: 1200, height: 630 }
    )
  }
}
