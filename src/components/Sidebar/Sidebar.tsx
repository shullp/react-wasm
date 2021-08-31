import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link, useLocation } from 'react-router-dom';
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import { SidebarData } from './SidebarData';
import SubMenu from './SubMenu';
import { IconContext } from 'react-icons/lib';

const Nav = styled.div`
  background: #15171c;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const NavLogo = styled.div`
  width: 150px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

const NavPathName = styled.div`
  width: 150px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  color: #fff;
  font-size: 26px;
`;

const NavTitle = styled.div`
  margin-left: 2rem;
  font-size: 1.5rem;
  height: 80px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  color: #fff;
`;

const SidebarNav = styled.nav`
  background: #15171c;
  width: 250px;
  height: 100vh;
  display: flex;
  justify-content: center;
  position: fixed;
  top: 0;
  left: ${({ sidebar }: any) => (sidebar ? '0' : '-100%')};
  transition: 350ms;
  z-index: 10;
`;

const SidebarWrap = styled.div`
  width: 100%;
`;

const Sidebar = () => {
  const [sidebar, setSidebar] = useState(true);  

  return (
    <>
      <IconContext.Provider value={{ color: '#fff' }}>
        <Nav>
          <div></div>
          <NavLogo>
            <Link to="/">
              <img src="logo-negative-color.svg" width={126} height={34} />
            </Link>
          </NavLogo>
        </Nav>
        {/* @ts-ignore */}
        <SidebarNav sidebar={sidebar}>
          <SidebarWrap>
            <NavTitle>
              WASM+React
            </NavTitle>

            {/* @ts-ignore */}
            {SidebarData.map((item, index) => {
              return <SubMenu item={item} key={index} />;
            })}
          </SidebarWrap>
        </SidebarNav>
      </IconContext.Provider>
    </>
  );
};

export default Sidebar;
