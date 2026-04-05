import styled from 'styled-components'
import Sidebar from './Sidebar'
import Topbar from './Topbar'

const AppWrapper = styled.div`
  display: flex;
  height: 100vh;
  overflow: hidden;
`

const Main = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-width: 0;
`

const Content = styled.main`
  flex: 1;
  overflow-y: auto;
  padding: 22px 24px;
`

export default function Layout({ children }) {
  return (
    <AppWrapper>
      <Sidebar />
      <Main>
        <Topbar />
        <Content>{children}</Content>
      </Main>
    </AppWrapper>
  )
}
