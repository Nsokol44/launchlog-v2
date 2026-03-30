import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const name      = searchParams.get('name')      || 'LaunchLog'
  const tagline   = searchParams.get('tagline')   || 'Discover what\'s next'
  const emoji     = searchParams.get('emoji')     || '🚀'
  const supporters = searchParams.get('supporters') || '0'
  const category  = searchParams.get('category')  || ''

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
          position: 'relative',
        }}
      >
        {/* Top bar */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '48px' }}>
          <span style={{ fontSize: '22px', fontWeight: '700', color: '#2d2420' }}>
            Launch<span style={{ color: '#ff7b5c' }}>Log</span>
          </span>
        </div>

        {/* Card */}
        <div style={{
          background: 'white',
          borderRadius: '24px',
          border: '1.5px solid #ecddd4',
          padding: '48px',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 20px 60px rgba(45,36,32,0.12)',
        }}>
          {/* Logo + name */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '24px' }}>
            <div style={{
              width: '80px', height: '80px',
              background: '#f5f5f5',
              borderRadius: '20px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '42px',
            }}>
              {emoji}
            </div>
            <div>
              <div style={{ fontSize: '42px', fontWeight: '700', color: '#2d2420', lineHeight: 1.1 }}>
                {name}
              </div>
              {category && (
                <div style={{
                  display: 'inline-block',
                  background: '#f5f0ff', color: '#7c5cbf',
                  fontSize: '14px', fontWeight: '600',
                  padding: '4px 12px', borderRadius: '99px',
                  marginTop: '8px',
                }}>
                  {category}
                </div>
              )}
            </div>
          </div>

          {/* Tagline */}
          <div style={{
            fontSize: '26px', color: '#7a6e68',
            lineHeight: 1.4, flex: 1,
            fontFamily: 'Georgia, serif',
            fontStyle: 'italic',
          }}>
            "{tagline}"
          </div>

          {/* Footer */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '28px' }}>🚀</span>
              <span style={{ fontSize: '20px', fontWeight: '700', color: '#ff7b5c' }}>
                {parseInt(supporters).toLocaleString()} supporters
              </span>
            </div>
            <div style={{
              background: '#ff7b5c', color: 'white',
              padding: '12px 24px', borderRadius: '99px',
              fontSize: '16px', fontWeight: '600',
            }}>
              Support on LaunchLog →
            </div>
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
