import "./Header.css"
import {Link} from "react-router-dom";
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

function Header() {
    return (
        <Navbar bg="custom" variant="dark" id="HeaderBar">
            <Container>
                <Link to="/home" style={{marginRight:'1%'}}> <img alt="header_logo" style={{display: "inline"}} src="/imgs/header_logo.png" /> </Link>
                <Link to="/home" style={{textDecoration:'none'}}><Navbar.Brand >HappyUS</Navbar.Brand> </Link>
                <Nav className="me-auto">
                    <Nav.Link ><Link to="/login" style={{textDecoration:'none', color :'white'}} >Home </Link> </Nav.Link>
                    <Nav.Link ><Link to="/login" style={{textDecoration:'none', color :'white'}} >Feature </Link></Nav.Link>
                    <Nav.Link ><Link to="/login" style={{textDecoration:'none', color :'white'} } >로그인 </Link></Nav.Link>
                </Nav>
            </Container>
            <DropdownButton variant="light" title="로그인" id="dropDown" style={{marginRight : '2%'}}>
                <Dropdown.Item> <Link to="/login" style={{textDecoration:'none', color :'black'}} >로그인 </Link> </Dropdown.Item>
                <Dropdown.Item> <Link to="/signup" style={{textDecoration:'none', color :'black'}} >회원가입 </Link> </Dropdown.Item>
            </DropdownButton>
        </Navbar>
    );
}
export default Header;