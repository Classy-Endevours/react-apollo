import React, { useState } from "react";
import {
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Container,
  Navbar,
  NavbarBrand,
} from "reactstrap";
import { useMutation } from "@apollo/client";
import { useHistory } from "react-router";
import Logo from "../../rickandmorty.png";
import { LOGIN_MUTATION } from "./mutation";
import { AUTH_TOKEN } from "../../constant/app";

export default function Login(props) {
  const history = useHistory();
  const [formState, setFormState] = useState({
    email: "",
    password: "",
  });
  const [login, {error}] = useMutation(LOGIN_MUTATION);
  const submit = () => {
    login({
      variables: formState,
      onCompleted: ({ login }) => {
        localStorage.setItem(AUTH_TOKEN, login.token);
        history.push("/");
      },
    })
  }

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
      </Navbar>

      <Container>
        <Form>
          <FormGroup>
            <Label for="exampleEmail">Email</Label>
            <Input
              type="email"
              name="email"
              id="exampleEmail"
              placeholder="with a placeholder"
              value={formState.email}
              onChange={(e) =>
                setFormState({
                  ...formState,
                  email: e.target.value,
                })
              }
            />
          </FormGroup>
          <FormGroup>
            <Label for="examplePassword">Password</Label>
            <Input
              type="password"
              name="password"
              id="examplePassword"
              placeholder="password placeholder"
              value={formState.password}
              onChange={(e) =>
                setFormState({
                  ...formState,
                  password: e.target.value,
                })
              }
            />
          </FormGroup>
          {
            error && <p>Something went wrong</p>
          }
          <Button onClick={() => submit()}>Submit</Button>
        </Form>
      </Container>
    </React.Fragment>
  );
}
