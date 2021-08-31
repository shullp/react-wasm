import styled from 'styled-components';

const ImgContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  justify-content: space-between;
`;

const HomePageContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 5rem;
  height: 100%;
`;

const Title = styled.div`
  background: -webkit-linear-gradient(#644ff1, #037bcd, #62dafb);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

function Home() {
  return (
    <div className="home">
      <HomePageContainer>
        <ImgContainer>
          <img src="WebAssembly_logo.png" width={200} height={200} style={{marginRight: 20}}/>
          <img src="AssemblyScript_logo.png" width={200} height={200} style={{marginRight: 20}}/>
          <img src="logo512.png" width={200} height={200} />
        </ImgContainer>

        <Title>SHOWCASE</Title>
      </HomePageContainer>
    </div>
  );
}

export default Home;
