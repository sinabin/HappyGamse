import "./Header.css"
import {Link} from "react-router-dom";
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import {useEffect, useState} from "react";

function Header() {

    const [isLogined, setIsLogined] = useState(false);

    useEffect(() => {
        fetch('/api/is-authenticated')
            .then(response => response.json())
            .then(isAuthenticated => {
                setIsLogined(isAuthenticated);
            });
    }, []);

    if (isLogined === true) {
        return (
            <Navbar bg="custom" variant="dark" id="HeaderBar">
                <Container>
                    <Link to="/" style={{marginRight: '1%'}}> <img alt="header_logo" style={{display: "inline"}} src="/imgs/header_logo.png"/> </Link>
                    <Link to="/" style={{textDecoration: 'none'}}><Navbar.Brand>HappyGames</Navbar.Brand> </Link>
                    <Nav className="me-auto">
                        <Nav.Link><Link to="/" style={{textDecoration: 'none', color: 'white'}}>게임 뉴스</Link> </Nav.Link>
                        <Nav.Link><Link to="/" style={{textDecoration: 'none', color: 'white'}}>실시간 핫토픽</Link></Nav.Link>
                        <Nav.Link><Link to="/" style={{textDecoration: 'none', color: 'white'}}>이벤트 & 할인 정보</Link></Nav.Link>
                        <Nav.Link><Link to="/" style={{textDecoration: 'none', color: 'white'}}>게임 친구찾기</Link></Nav.Link>
                    </Nav>
                </Container>
                <DropdownButton variant="light" title="My Page" id="dropDown" style={{marginRight: '2%'}}>
                    <Dropdown.Item> <Link to="/myPage" style={{textDecoration: 'none', color: 'black'}}>내정보</Link></Dropdown.Item>
                    <Dropdown.Item> <Link to="/memberShip" style={{textDecoration: 'none', color: 'black'}}>멤버십 관리</Link></Dropdown.Item>
                    <Dropdown.Item> <Link to="/MyPost" style={{textDecoration: 'none', color: 'black'}}>내 게시물 관리</Link></Dropdown.Item>
                    <Dropdown.Item href={"/logout"}>로그아웃 </Dropdown.Item>
                </DropdownButton>
            </Navbar>
        );
    } else {
        return (
            <Navbar bg="custom" variant="dark" id="HeaderBar">
                <Container>
                    <Link to="/" style={{marginRight: '1%'}}> <img alt="header_logo" style={{display: "inline"}} src="/imgs/header_logo.png"/> </Link>
                    <Link to="/" style={{textDecoration: 'none'}}><Navbar.Brand>HappyGames</Navbar.Brand> </Link>
                    <Nav className="me-auto">
                        <Nav.Link><Link to="/" style={{textDecoration: 'none', color: 'white'}}>게임 뉴스</Link> </Nav.Link>
                        <Nav.Link><Link to="/" style={{textDecoration: 'none', color: 'white'}}>실시간 핫토픽</Link></Nav.Link>
                        <Nav.Link><Link to="/" style={{textDecoration: 'none', color: 'white'}}>이벤트 & 할인 정보</Link></Nav.Link>
                        <Nav.Link><Link to="/" style={{textDecoration: 'none', color: 'white'}}>게임 친구찾기</Link></Nav.Link>
                    </Nav>
                </Container>
                <DropdownButton variant="light" title="로그인" id="dropDown" style={{marginRight: '2%'}}>
                    <Dropdown.Item href={"/loginPage"}>로그인 </Dropdown.Item>
                    <Dropdown.Item href={"/register/agreement"}>회원가입 </Dropdown.Item>
                </DropdownButton>
            </Navbar>
        );
    }
}

export default Header;