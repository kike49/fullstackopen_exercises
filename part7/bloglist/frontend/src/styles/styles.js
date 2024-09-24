import { Link } from "react-router-dom"
import styled from "styled-components"

export const Box = styled.div`
  padding: 1em;
  margin: 1em;
  padding: 0.25em 1em;
  border: 2px solid #99aabb;
  border-radius: 3px;
  background-color: #f0f4f8;
`

export const NavbarContainer = styled.nav`
  background-color: #7f8fa6;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 2px solid #99aabb;
`

export const NavLinks = styled.div`
  display: flex;
  gap: 2rem;
  align-items: center;
`

export const StyledLink = styled(Link)`
  color: #ffffff;
  text-decoration: none;
  font-size: 1.1rem;
  font-weight: bold;
  padding: 0.5rem 1rem;

  &:hover {
    color: #b2c2d9;
  }
`

export const LogoutButton = styled.button`
  background-color: #d9534f;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  cursor: pointer;
  border-radius: 5px;

  &:hover {
    background-color: #c9302c;
  }
`