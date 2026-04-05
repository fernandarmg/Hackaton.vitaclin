import styled, { css } from 'styled-components'

// ── Card ────────────────────────────────────────────────
export const Card = styled.div`
  background: #fff;
  border: 1px solid ${({ theme }) => theme.colors.g200};
  border-radius: ${({ theme }) => theme.radii.xl};
  padding: 18px;
  box-shadow: ${({ theme }) => theme.shadows.sm};
`

export const CardTitle = styled.h3`
  font-size: 13px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.g900};
  margin-bottom: 12px;
  letter-spacing: -.1px;
`

// ── Stat Card ───────────────────────────────────────────
export const StatGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(${({ cols }) => cols || 5}, 1fr);
  gap: 14px;
  margin-bottom: 20px;
`

export const StatCard = styled(Card)`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 18px;
  transition: all .2s;
  cursor: default;

  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.md};
    transform: translateY(-1px);
  }

  ${({ $accent, theme }) => $accent && css`
    background: ${theme.colors.b1};
    border-color: ${theme.colors.b1};
    * { color: #fff !important; }
  `}
`

export const StatIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background: ${({ bg }) => bg || 'var(--g100)'};
`

export const StatValue = styled.div`
  font-size: 24px;
  font-weight: 700;
  letter-spacing: -.5px;
  line-height: 1;
  color: ${({ theme }) => theme.colors.g900};
`

export const StatLabel = styled.div`
  font-size: 11.5px;
  color: ${({ theme }) => theme.colors.g500};
  margin-top: 3px;
`

export const StatTrend = styled.div`
  font-size: 10.5px;
  margin-top: 3px;
  color: ${({ $up, theme }) => $up ? theme.colors.b3 : theme.colors.red};
`

// ── Grid layouts ─────────────────────────────────────────
export const Grid2 = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
  margin-bottom: 18px;
`

export const Grid3 = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
  margin-bottom: 18px;
`

// ── Badge ────────────────────────────────────────────────
const badgeVariants = {
  sky:    css`background: #e8f5fa; color: #2e5f7a;`,
  teal:   css`background: #e8f5fa; color: #2e9ac4;`,
  amber:  css`background: #fef3e2; color: #a6670e;`,
  red:    css`background: #fdf1f1; color: #8b2020;`,
  navy:   css`background: #dceaf0; color: #2e5f7a;`,
  gray:   css`background: #edf1f5; color: #587080;`,
  purple: css`background: #e4eef4; color: #2e5f7a;`,
}

export const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 2px 9px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 600;
  white-space: nowrap;
  ${({ $variant }) => badgeVariants[$variant] || badgeVariants.gray}
`

// ── Button ───────────────────────────────────────────────
export const Button = styled.button`
  padding: 7px 14px;
  border-radius: 8px;
  font-size: 13px;
  font-family: inherit;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border: 1px solid ${({ theme }) => theme.colors.g300};
  background: #fff;
  color: ${({ theme }) => theme.colors.g700};
  transition: all .15s;
  font-weight: 500;
  line-height: 1;

  &:hover {
    background: ${({ theme }) => theme.colors.g50};
    border-color: ${({ theme }) => theme.colors.g400};
  }

  &.sm { padding: 5px 12px; font-size: 12px; }
`

export const PrimaryButton = styled(Button)`
  background: ${({ theme }) => theme.colors.b3};
  color: #fff;
  border-color: ${({ theme }) => theme.colors.b3};
  box-shadow: 0 2px 8px rgba(46,154,196,.28);

  &:hover {
    background: ${({ theme }) => theme.colors.b2};
    border-color: ${({ theme }) => theme.colors.b2};
  }
`

export const DangerButton = styled(Button)`
  background: ${({ theme }) => theme.colors.redL};
  color: ${({ theme }) => theme.colors.red};
  border-color: ${({ theme }) => theme.colors.redB};
`

// ── Table ────────────────────────────────────────────────
export const TableWrap = styled.div`
  background: #fff;
  border: 1px solid ${({ theme }) => theme.colors.g200};
  border-radius: ${({ theme }) => theme.radii.xl};
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadows.sm};
`

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`

export const Th = styled.th`
  padding: 9px 14px;
  font-size: 10px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.g500};
  text-transform: uppercase;
  letter-spacing: .6px;
  background: ${({ theme }) => theme.colors.g50};
  border-bottom: 1px solid ${({ theme }) => theme.colors.g200};
  text-align: left;
  white-space: nowrap;
`

export const Td = styled.td`
  padding: 11px 14px;
  font-size: 13px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.g100};
  vertical-align: middle;

  tr:last-child & { border-bottom: none; }
  tr:hover & { background: ${({ theme }) => theme.colors.g50}; }
`

// ── Form ─────────────────────────────────────────────────
export const FormInput = styled.input`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid ${({ theme }) => theme.colors.g300};
  border-radius: 8px;
  font-size: 13px;
  font-family: inherit;
  background: #fff;
  color: ${({ theme }) => theme.colors.g900};
  outline: none;
  transition: border-color .15s;

  &:focus {
    border-color: ${({ theme }) => theme.colors.b3};
    box-shadow: 0 0 0 3px rgba(46,154,196,.1);
  }
`

export const FormSelect = styled.select`
  padding: 7px 12px;
  border: 1px solid ${({ theme }) => theme.colors.g300};
  border-radius: 8px;
  font-size: 13px;
  font-family: inherit;
  background: #fff;
  color: ${({ theme }) => theme.colors.g800};
  outline: none;
  transition: border-color .15s;
  cursor: pointer;

  &:focus {
    border-color: ${({ theme }) => theme.colors.b3};
    box-shadow: 0 0 0 3px rgba(46,154,196,.1);
  }
`

export const FormLabel = styled.label`
  display: block;
  font-size: 11px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.g600};
  margin-bottom: 4px;
  letter-spacing: .2px;
  text-transform: uppercase;
`

export const FormGroup = styled.div`
  margin-bottom: 13px;
`

// ── Page header ──────────────────────────────────────────
export const PageHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 20px;
`

export const PageTitle = styled.h2`
  font-size: 19px;
  font-weight: 700;
  letter-spacing: -.4px;
  color: ${({ theme }) => theme.colors.g900};
`

export const PageSub = styled.p`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.g500};
  margin-top: 2px;
`

// ── Empty state ──────────────────────────────────────────
export const Empty = styled.div`
  text-align: center;
  padding: 32px;
  color: ${({ theme }) => theme.colors.g300};
  font-size: 13px;
`

// ── Bar chart row ────────────────────────────────────────
export const BarRow = styled.div`
  display: flex;
  align-items: center;
  gap: 9px;
  margin-bottom: 8px;
`

export const BarLabel = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.g600};
  width: 96px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex-shrink: 0;
`

export const BarTrack = styled.div`
  flex: 1;
  height: 18px;
  background: ${({ theme }) => theme.colors.g100};
  border-radius: 4px;
  overflow: hidden;
`

export const BarFill = styled.div`
  height: 100%;
  border-radius: 4px;
  background: ${({ color }) => color};
  width: ${({ pct }) => pct}%;
  transition: width .6s cubic-bezier(.4,0,.2,1);
`

export const BarValue = styled.div`
  font-size: 12px;
  font-weight: 700;
  min-width: 24px;
  text-align: right;
  flex-shrink: 0;
  color: ${({ color }) => color};
`
