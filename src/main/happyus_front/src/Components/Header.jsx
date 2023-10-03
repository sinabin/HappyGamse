import "./Header.css"
import {Link} from "react-router-dom";
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import {useEffect, useState} from "react";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import axios from "axios";

function Header() {

    const [isLogined, setIsLogined] = useState(false);

    useEffect(() => {
        const api_result = async () => {
            const response = await fetch("/api/is-authenticated");
            const isAuthenticated = await response.json();
            setIsLogined(isAuthenticated);
        };
        api_result();
        },[]);

    return (
        <Navbar bg="custom" variant="dark" id="HeaderBar" expand="lg">
            <Container>
                <Link to="/" style={{marginRight: '1%'}}>
                    <img alt="header_logo" style={{display: "inline"}} src="/imgs/header_logo.png"/>
                </Link>
                <Link to="/" style={{textDecoration: 'none'}}>
                    <Navbar.Brand>HappyGames</Navbar.Brand>
                </Link>

                <Navbar.Toggle aria-controls="responsive-navbar-nav" />

                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link>
                            <Link to="/" className="link-style">
                                <FontAwesomeIcon icon="fa-solid fa-headset" beat /> 게임 친구찾기
                            </Link>
                        </Nav.Link>
                        <Nav.Link>
                            <Link to="/news" className="link-style">
                                <FontAwesomeIcon icon="fa-solid fa-window-maximize" beat /> 요약 뉴스
                            </Link>
                        </Nav.Link>
                        <Nav.Link>
                            <Link to="/" className="link-style">
                                <FontAwesomeIcon icon="fa-solid fa-user-group" beat /> 커뮤니티
                            </Link>
                        </Nav.Link>
                        <Nav.Link>
                            <Link to="/" className="link-style">
                                <FontAwesomeIcon icon="fa-solid fa-sack-dollar" beat /> 이벤트 및 할인 정보
                            </Link>
                        </Nav.Link>
                    </Nav>

                    {isLogined ? (
                        <DropdownButton variant="light" title="My Page" id="dropDown" style={{marginRight: '2%'}}>
                            <Dropdown.Item> <Link to="/myPage" className="dropdown-link-style">내정보</Link></Dropdown.Item>
                            <Dropdown.Item> <Link to="/memberShip" className="dropdown-link-style">멤버십 관리</Link></Dropdown.Item>
                            <Dropdown.Item> <Link to="/MyPost" className="dropdown-link-style">내 게시물 관리</Link></Dropdown.Item>
                            <Dropdown.Item href={"/logout"}>로그아웃 </Dropdown.Item>
                        </DropdownButton>
                    ) : (
                        <DropdownButton variant="light" title="로그인" id="dropDown" style={{marginRight: '2%'}}>
                            <Dropdown.Item href={"/loginPage"}>로그인 </Dropdown.Item>
                            <Dropdown.Item href={"/register/agreement"}>회원가입 </Dropdown.Item>
                        </DropdownButton>
                    )}

                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default Header;