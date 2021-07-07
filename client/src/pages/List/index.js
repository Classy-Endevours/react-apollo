import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import Logo from "../../rickandmorty.png";
import {
  Container,
  Row,
  Col,
  Card,
  CardImg,
  CardText,
  CardBody,
  CardTitle,
  Spinner,
  Badge,
  Navbar,
  NavbarBrand,
  Button,
  NavbarToggler,
  Collapse,
  Nav,
  NavItem,
  NavLink,
} from "reactstrap";
import { useHistory } from "react-router";

import { GET_ALL_EVENTS } from "./query";
import { AUTH_TOKEN, LOGIN_STATUS } from './../../constant/app';

function App() {
  const [collapsed, setCollapsed] = useState(true);
  const history = useHistory();
  const toggleNavbar = () => setCollapsed(!collapsed);
  const logout = () => {
    localStorage.removeItem(AUTH_TOKEN)
    localStorage.removeItem(LOGIN_STATUS)
    history.replace("/login");
    
  }
  // useQuery is a custom hook.
  const { loading, error, data } = useQuery(GET_ALL_EVENTS);

  if (loading)
    return (
      <div style={{ textAlign: "center" }}>
        {" "}
        <Spinner color="warning" /> Loading...
      </div>
    );
  if (error)
    return (
      <div style={{ textAlign: "center" }}>
        {" "}
        <Spinner color="danger" /> Oppss !! TURN OFF AdBlock
      </div>
    );

  console.log(data);
  const newData = data.events;

  return (
    <React.Fragment>
      <Navbar color="faded" light>
        <NavbarBrand href="/" className="mr-auto">
          <img
            style={{ height: "100px", width: "300px", marginBottom: "40px" }}
            src={Logo}
            alt="rickandmorty"
          />
        </NavbarBrand>
        <NavbarToggler onClick={toggleNavbar} className="mr-2" />
        <Collapse isOpen={!collapsed} navbar>
          <Nav navbar>
            <NavItem>
              <NavLink target="_blank" href="https://rickandmortyapi.com/">
                Rick and Morty API
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink target="_blank" href="https://github.com/">
                My GitHub
              </NavLink>
            </NavItem>
            <NavItem>
              <Button onClick={() => logout()}>Logout</Button>
            </NavItem>
          </Nav>
        </Collapse>
      </Navbar>

      <Container>
        <Row xs="4">
          {newData.map((item) => {
            return (
              <Col key={item._id} style={{ marginBottom: "10px" }}>
                <Card>
                  <CardImg
                    top
                    width="100%"
                    src="https://picsum.photos/200/300"
                    alt="RickandMorty"
                  />
                  <CardBody>
                    <CardTitle>
                      <b>{item.title}</b>
                    </CardTitle>
                    <Badge color="info">{item.date}</Badge>
                    <CardText>
                      Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    </CardText>
                    <Badge color="warning">rs {item.price}</Badge>
                    <CardText>{item.creator.email}</CardText>
                    <CardText>{item.description}</CardText>
                  </CardBody>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Container>
    </React.Fragment>
  );
}

export default App;
