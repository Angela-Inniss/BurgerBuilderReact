import React from "react";

import { configure, shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import NavigationItem from "./NavigationItem";
import NavigationItems from "../NavigationItems";



configure({ adapter: new Adapter() });

describe("NavigationItems", () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<NavigationItems/>);
  });

  it("should render two NavigationItem  elements if not authenticated", () => {
    expect(wrapper.find(NavigationItem)).toHaveLength(2);
  });

  it("should render three NavigationItem  elements if authenticated", () => {
    // wrapper = shallow(<NavigationItems isAuthenticated />);
    wrapper.setProps({ isLoggedIn: true });
    expect(wrapper.find(NavigationItem)).toHaveLength(3);
  });

  it("should an exact logout button", () => {
    wrapper.setProps({ isLoggedIn: true });
    expect(
      wrapper.contains(<NavigationItem link="/logout">Logout</NavigationItem>)
    ).toEqual(true);
  });
});

// tests don't run - need provider and to fix because I used UseState in my component
