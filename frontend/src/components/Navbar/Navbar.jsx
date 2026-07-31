// import Navlink component from react-router-dom
import { NavLink } from "react-router-dom"
// import CSS
import "./Navbar.css";

const Navbar = () => {
  return (
    <nav id="navbar">
      <h1>Party Time!</h1>
      <ul>
        <li>
            <NavLink to={"/"}
            className={({isActive}) => (isActive ? "active" : "")}
            >
            Minhas Festas
            </NavLink>
        </li>
        <li>
            <NavLink to={"/party/new"}
            className={`btn ${({isActive}) => (isActive ? "active" : "")}`}>
            Criar Festa
            </NavLink>
        </li>
      </ul>
    </nav>
  )
}

export default Navbar;
