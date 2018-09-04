import * as React from "react";

export const Navigation: React.StatelessComponent<{}> = () => {
    return (
        <nav className="navbar navbar-default navbar-fixed-top" id="nav-bar">
            <h5>Arc-Inc v0.16</h5>
            <h5>Press [ESC] to pause</h5>
            <div className="checkbox">
                <label><input type="checkbox" value="true" id="always-trail" />Trail without clicking</label>
            </div>
            <a href="https://discord.gg/C8Y5xNE"><h5 className="text-light">Discord</h5></a>
            <h5 id="credits"/>
        </nav>
    );
};