import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import { gql } from "apollo-boost";
import Logo from "../rickandmorty.png";
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
  NavbarToggler,
  Collapse,
  Nav,
  NavItem,
  NavLink
} from "reactstrap";

const rickandmorty = gql`
  {
    characters {
      results {
        id
        name
        image
        gender
        species
      }
    }
  }
`;

function App() {
  const [collapsed, setCollapsed] = useState(true);
  const toggleNavbar = () => setCollapsed(!collapsed);

  // useQuery is a custom hook.
  const { loading, error, data } = useQuery(rickandmorty);

  if (loading) return <div style={{textAlign: "center"}}> <Spinner color="warning" /> Loading...</div>;
  if (error) return <div style={{textAlign: "center"}} > <Spinner color="danger" /> Oppss !! TURN OFF AdBlock</div>;

  const newData = data.characters.results;
  console.log(newData);

  return (
  <React.Fragment>
    <Navbar color="faded" light>
        <NavbarBrand href="/" className="mr-auto"><img style={{height:"100px",width:"300px",marginBottom: "40px"}} src={Logo} alt="rickandmorty"/></NavbarBrand>
        <NavbarToggler onClick={toggleNavbar} className="mr-2" />
        <Collapse isOpen={!collapsed} navbar>
          <Nav navbar>
            <NavItem>
              <NavLink target="_blank" href="https://rickandmortyapi.com/">Rick and Morty API</NavLink>
            </NavItem>
            <NavItem>
              <NavLink target="_blank" href="https://github.com/ffcabbar">My GitHub</NavLink>
            </NavItem>
          </Nav>
        </Collapse>
      </Navbar>

    <Container>
      <Row xs="5">
        {newData.map(item => {
          return (
            <Col key={item.id} style={{marginBottom: "10px"}} >
              <Card>
                <CardImg top width="100%" src={item.image} alt="RickandMorty" />
                <CardBody>
                  <CardTitle><b>{item.name}</b></CardTitle>
                  <Badge color="info">{item.species}</Badge>
                  <CardText>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  </CardText>
                  <Badge color="warning">{item.gender}</Badge>
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
