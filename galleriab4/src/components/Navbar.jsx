import { useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import logo from '../assets/img/logo_galleriaB4.gif';
import './Navbar.css';

export default function Navbar() {
  const { pathname } = useLocation();
  const isMostre = pathname.startsWith('/mostre');

  useEffect(() => {
    function closeMenuOnOutsideClick(e) {
      const menuEl = document.getElementById('navbarSupportedContent');
      if (!menuEl || !menuEl.classList.contains('show')) return;

      const togglerEl = document.querySelector('.navbar-toggler');
      if (togglerEl && togglerEl.contains(e.target)) return;

      if (!window.bootstrap?.Collapse) return;
      const bsCollapse =
        window.bootstrap.Collapse.getInstance(menuEl) ||
        new window.bootstrap.Collapse(menuEl, { toggle: false });
      bsCollapse.hide();
    }

    document.addEventListener('click', closeMenuOnOutsideClick);
    return () => document.removeEventListener('click', closeMenuOnOutsideClick);
  }, []);

  return (
    <nav className={`navbar navbar-expand-lg navbar-light${isMostre ? ' navbar-solid-mobile' : ''}`}>
  <div className="container-fluid">
    {/* <a className="navbar-brand" href="#">Navbar</a> */}
      {/* <img src={logo} alt="Logo" className="navbar-logo d-block" /> */}
      <span className="navbar-brand-text">
        Galleria B4
        <br />
        <small>Arte contemporanea</small>
      </span>

    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span className="navbar-toggler-icon"></span>
    </button>
    <div className="collapse navbar-collapse" id="navbarSupportedContent">
      <ul className="navbar-nav me-auto mb-2 mb-lg-0">
        <li className="nav-item">
          <NavLink className="nav-link" end to="/">HOME</NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link" to="/mostre">MOSTRE</NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link" to="/artisti">ARTISTI</NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link" to="/contatti">CONTATTI</NavLink>
        </li>        
        <li className="nav-item">
          <NavLink className="nav-link" to="/info">INFO</NavLink>
        </li>        
        {/* <li className="nav-item dropdown">
          <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
            INFO
          </a>
          <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
            <li><a className="dropdown-item" href="#">Action</a></li>
            <li><a className="dropdown-item" href="#">Another action</a></li>
            <li><hr className="dropdown-divider"/></li>
            <li><a className="dropdown-item" href="#">Something else here</a></li>
          </ul>
        </li> */}
      </ul>
      {/* <form className="d-flex">
        <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search"/>
        <button className="btn btn-outline-success" type="submit">Search</button>
      </form> */}
    </div>
  </div>
</nav>
  );
}
