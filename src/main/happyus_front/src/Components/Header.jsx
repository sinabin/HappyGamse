import "./Header.css"
import {Link} from "react-router-dom";
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {useAuthentication} from '../contexts/AuthenticationContext'

function Header() {

    const isLogined = useAuthentication();


    return (
        <div>
        <Navbar bg="custom" variant="dark" id="HeaderBar" expand="lg">
            <Container>
                <Link to="/" style={{marginRight: '1%'}}>
                    <img alt="header_logo" style={{display: "inline"}} src="/imgs/header_logo.png"/>
                </Link>
                <Link to="/" style={{textDecoration: 'none', fontWeight:"bold"}}>
                    <Navbar.Brand>HappyGames</Navbar.Brand>
                </Link>

                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                {/* NavBar Area*/ }
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link>
                            <Link to="/news" className="link-style">
                                <FontAwesomeIcon icon="fa-solid fa-window-maximize" beat /> 게임 뉴스
                            </Link>
                        </Nav.Link>
                        <Nav.Link>
                            <Link to="/friend" className="link-style">
                                <FontAwesomeIcon icon="fa-solid fa-headset" beat /> Chat & Voice
                            </Link>
                        </Nav.Link>
                        <Nav.Link>
                            <Link to="/community" className="link-style">
                                <FontAwesomeIcon icon="fa-solid fa-user-group" beat /> 커뮤니티
                            </Link>
                        </Nav.Link>
                    </Nav>

                    {/* DropDownBtn Area*/ }
                    {isLogined.user_id ? (
                        <DropdownButton variant="success" title="My Page" id="dropDown" style={{marginRight: '2%'}}>
                            <Dropdown.Item> <Link to="user/myPage" className="dropdown-link-style">내정보</Link></Dropdown.Item>
                            <Dropdown.Item> <Link to="user/myPost" className="dropdown-link-style">내 게시물 관리</Link></Dropdown.Item>
                            <Dropdown.Item href={"/logout"}>로그아웃 </Dropdown.Item>
                        </DropdownButton>
                    ) : (
                        <DropdownButton variant="success" title="로그인" id="dropDown" style={{marginRight: '2%'}}>
                            <Dropdown.Item href={"/loginPage"}>로그인 </Dropdown.Item>
                            <Dropdown.Item href={"/register/agreement"}>회원가입 </Dropdown.Item>
                        </DropdownButton>
                    )}

                </Navbar.Collapse>
            </Container>
        </Navbar>
        </div>
    );
}

export default Header;