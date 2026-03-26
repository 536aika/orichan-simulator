import { useState } from 'react';
import { Box, Container, Typography, Card, CardActionArea, TextField, Button, Paper, Divider } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const theme = createTheme({
  palette: {
    mode: 'dark',
    background: { default: '#0a0a0a', paper: '#111111' },
    primary: { main: '#c8a96e' },
    text: { primary: '#f0f0f0', secondary: '#888888' },
  },
  typography: { fontFamily: '"Noto Sans JP", sans-serif' },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '& fieldset': { borderColor: '#333' },
            '&:hover fieldset': { borderColor: '#c8a96e' },
            '&.Mui-focused fieldset': { borderColor: '#c8a96e' },
          },
          '& .MuiInputLabel-root.Mui-focused': { color: '#c8a96e' },
        }
      }
    }
  }
});

const WHOLESALE = 1200;
const SCALES = [
  { id: 'small',  label: '小規模', sub: 'スタート', saving: 5000000,  desc: '初めての参入に' },
  { id: 'medium', label: '中規模', sub: 'スタート', saving: 7000000,  desc: '本格展開向け' },
  { id: 'large',  label: '大規模', sub: 'スタート', saving: 10000000, desc: 'ブランド確立へ' },
];
const fmt = (n) => n.toLocaleString('ja-JP');

export default function App() {
  const [selectedScale, setSelectedScale] = useState(null);
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [result, setResult] = useState(null);
  const [animating, setAnimating] = useState(false);

  const handleCalc = () => {
    const p = parseInt(price), q = parseInt(quantity);
    if (!p || !q || p < 1 || q < 1) return;
    setResult({ revenue: p * q, cost: WHOLESALE * q, profit: (p - WHOLESALE) * q });
    setAnimating(true);
    setTimeout(() => setAnimating(false), 3600);
  };

  const scale = SCALES.find(s => s.id === selectedScale);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', background: 'linear-gradient(160deg,#0a0a0a 0%,#0f0c07 50%,#0a0a0a 100%)', py: { xs: 4, md: 6 }, px: 2 }}>
        <Container maxWidth="sm">

          <Box sx={{ textAlign: 'center', mb: 5 }}>
            <Typography sx={{ color: '#c8a96e', letterSpacing: '0.25em', fontSize: '0.7rem', display: 'block', mb: 1.5 }}>
              ORICHAN OEM — PROFIT SIMULATOR
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 700, lineHeight: 1.3, fontSize: { xs: '1.6rem', md: '2rem' } }}>
              いくら儲かるか、<br />
              <Box component="span" sx={{ color: '#c8a96e' }}>今すぐ確認</Box>してください。
            </Typography>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography sx={{ color: '#888', fontSize: '0.65rem', display: 'block', mb: 2 }}>STEP 01 — 規模を選ぶ</Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 1.5 }}>
              {SCALES.map(s => (
                <Card key={s.id} sx={{ backgroundColor: '#141414', border: selectedScale === s.id ? '1.5px solid #c8a96e' : '1px solid #2a2a2a', transition: 'all 0.2s' }}>
                  <CardActionArea onClick={() => { setSelectedScale(s.id); setResult(null); }} sx={{ p: 2, textAlign: 'center' }}>
                    <Typography sx={{ fontSize: '1.1rem', fontWeight: 700, color: selectedScale === s.id ? '#c8a96e' : '#f0f0f0' }}>{s.label}</Typography>
                    <Typography sx={{ fontSize: '0.65rem', color: '#888' }}>{s.sub}</Typography>
                    <Typography sx={{ fontSize: '0.6rem', color: '#666' }}>{s.desc}</Typography>
                  </CardActionArea>
                </Card>
              ))}
            </Box>
            {scale && (
              <Box sx={{ mt: 2.5, p: 2.5, background: 'linear-gradient(135deg,rgba(200,169,110,0.12),rgba(200,169,110,0.06))', border: '1px solid rgba(200,169,110,0.35)', borderRadius: 2, textAlign: 'center' }}>
                <Typography sx={{ fontSize: '0.7rem', color: '#c8a96e', mb: 0.5 }}>通常かかる初期費用</Typography>
                <Typography sx={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff' }}>
                  ¥{fmt(scale.saving)}
                  <Box component="span" sx={{ fontSize: '0.9rem', fontWeight: 600, color: '#c8a96e', ml: 1 }}>が、まるごとカット</Box>
                </Typography>
                <Typography sx={{ fontSize: '0.65rem', color: '#888', mt: 0.5 }}>初期費用 ¥0 でスタートできます</Typography>
              </Box>
            )}
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography sx={{ color: '#888', fontSize: '0.65rem', display: 'block', mb: 2 }}>STEP 02 — 月間利益を試算する</Typography>
            <Paper sx={{ p: 3, background: '#0f0f0f', border: '1px solid #1e1e1e', borderRadius: 2 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Box>
                  <TextField fullWidth label="販売したい価格（円／本）" type="number" value={price}
                    onChange={e => { setPrice(e.target.value); setResult(null); }} inputProps={{ min: 1 }} size="small" />
                  <Typography sx={{ fontSize: '0.62rem', color: '#555', mt: 0.8 }}>
                    ※ 全国のオリシャン屋はLED・アクキー等のオプション含め、平均販売価格 ¥3,480／本
                  </Typography>
                </Box>
                <TextField fullWidth label="月間販売本数（本）" type="number" value={quantity}
                  onChange={e => { setQuantity(e.target.value); setResult(null); }} inputProps={{ min: 1 }} size="small" />
                <Button variant="contained" fullWidth size="large" onClick={handleCalc} disabled={!price || !quantity}
                  sx={{ backgroundColor: '#c8a96e', color: '#0a0a0a', fontWeight: 700, py: 1.5, '&:hover': { backgroundColor: '#b8996e' }, '&:disabled': { backgroundColor: '#2a2a2a', color: '#555' } }}>
                  月間の利益を計算する
                </Button>
              </Box>
              {result && (
                <Box sx={{ mt: 3 }}>
                  <Divider sx={{ borderColor: '#1e1e1e', mb: 2.5 }} />
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography sx={{ fontSize: '0.8rem', color: '#666' }}>月間売上（目安）</Typography>
                      <Typography sx={{ fontSize: '0.95rem', color: '#aaa' }}>¥{fmt(result.revenue)}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography sx={{ fontSize: '0.8rem', color: '#666' }}>卸仕入れ合計<Box component="span" sx={{ fontSize: '0.65rem', color: '#444', ml: 0.5 }}>（¥1,200×{quantity}本）</Box></Typography>
                      <Typography sx={{ fontSize: '0.95rem', color: '#aaa' }}>¥{fmt(result.cost)}</Typography>
                    </Box>
                    <Divider sx={{ borderColor: '#2a2a2a' }} />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 0.5 }}>
                      <Typography sx={{ fontSize: '0.85rem', color: '#c8a96e', fontWeight: 600 }}>月間粗利</Typography>
                      <Typography sx={{ fontSize: '1.6rem', fontWeight: 900, color: '#c8a96e', animation: animating ? 'blink 1.2s ease-in-out 3' : 'none', '@keyframes blink': { '0%,100%': { opacity: 1 }, '50%': { opacity: 0.15 } } }}>
                        ¥{fmt(result.profit)}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              )}
            </Paper>
          </Box>

          <Box sx={{ textAlign: 'center', p: 3.5, border: '1px solid rgba(200,169,110,0.25)', borderRadius: 2, background: 'rgba(200,169,110,0.04)' }}>
            <Typography sx={{ fontSize: '0.75rem', color: '#888', mb: 1 }}>初期費用¥0で、この利益を手に入れる</Typography>
            <Typography sx={{ fontSize: '1.1rem', fontWeight: 700, mb: 2.5 }}>残り<Box component="span" sx={{ color: '#c8a96e' }}>8枠</Box>。満枠次第、価格改定。</Typography>
            <Button variant="outlined" fullWidth size="large"
              href="https://orichan-lp.vercel.app/#cal-section" target="_blank"
              sx={{ borderColor: '#c8a96e', color: '#c8a96e', fontWeight: 700, py: 1.5, '&:hover': { borderColor: '#e0c080', color: '#e0c080' } }}>
              無料説明会を予約する →
            </Button>
            <Typography sx={{ fontSize: '0.62rem', color: '#555', mt: 1.5 }}>説明会30分完結・完全オンライン・来社不要</Typography>
          </Box>

        </Container>
      </Box>
    </ThemeProvider>
  );
}
