import { ReactNode, useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Confirm, Container, Menu, Icon, Button, Sidebar, Dropdown, Label } from "semantic-ui-react";
import { MENU_ITEMS } from "@data/constants";
import { useAppState } from "@state";
import RightPart from "./RightPart";
import { AronaInput } from "@components/Form";
import { useMedia } from "use-media";
// import sty
import styles from "./styles.module.scss";
import { useUnreadMessageCount } from "@utils/hooks";

interface AppLayoutProps {
  children: ReactNode;
  hideSearch?: boolean;
}

const AppLayout = (props: AppLayoutProps) => {
  const isWideScreen = useMedia({ minWidth: "1100px" });
  const isNarrowScreen = !useMedia({ minWidth: "500px" });
  useEffect(() => {
    const font = new FontFace("Saira", "url(/saira-latin-500.woff2)");
    document.fonts.add(font);
    font.load();
  }, []);

  const { self, setSelf } = useAppState();
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [search, setSearch] = useState<string>();
  const navigate = useNavigate();
  const onSearch = () => {
    navigate(search ? `/search?searchFor=${search}` : "/search");
  };

  const UserItem = () => {
    if (self !== null) {
      // logged in
      return <>
        <Menu.Item
          className="compact"
          key={-1}
          as={NavLink}
          to={`/user/${self.username}`}
        >
          <Icon className={"user"} />
          <span style={{ fontSize: "1.1rem" }}>我的主页</span>
        </Menu.Item>
        <Menu.Item
          className="compact"
          key={-2}
          onClick={() => setOpen(true)}
        >
          <Icon className={"sign out"} />
          <span style={{ fontSize: "1.1rem" }}>登出</span>
        </Menu.Item>
      </>;
    }
    return <>
      <Menu.Item
        className="compact"
        key={-1}
        as={NavLink}
        to={"/login"}
      >
        <Icon className={"sign in"} />
        <span style={{ fontSize: "1.1rem" }}>登录</span>
      </Menu.Item>
      <Menu.Item
        className="compact"
        key={-2}
        as={NavLink}
        to={"/register"}
      >
        <Icon className={"arrow alternate circle right outline"} />
        <span style={{ fontSize: "1.1rem" }}>注册</span>
      </Menu.Item>
    </>;
  };
  const MyDropdown = () => {
    const unreadMessageCount = useUnreadMessageCount(self ? self.jwt : "");
    const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
    const sidebarOpenStatusClassName = sidebarOpen ? " " + styles.sidebarOpen : "";
    useEffect(() => { setSidebarOpen(false); }, []);
    return (
      <>
        <div className={styles.sidebarDimmer + sidebarOpenStatusClassName} onClick={() => setSidebarOpen(false)}></div>
        <Menu.Menu position="right" style={{ margin: "0 0.5rem 0 0" }}>
          <Menu.Item icon="bars" onClick={() => setSidebarOpen(true)} />
        </Menu.Menu>
        <Sidebar
          compact
          as={Menu}
          className={styles.sidebarMenu + sidebarOpenStatusClassName}
          animation="push"
          direction="right"
          vertical
          visible
        >
          {<Menu.Header as="h2" style={{ marginLeft: "1rem", marginTop: "1rem", marginBottom: "1rem" }}>A.R.O.N.A.</Menu.Header>}
          {/* {<Menu.Header as="h4" style={{ marginLeft: "1rem", marginBottom: "0.5rem", marginTop: "1.5rem" }}>主要功能</Menu.Header>} */}
          {
            MENU_ITEMS.filter((item) => item.show === 0).map((item) => (
              <Menu.Item
                className="compact"
                key={item.id}
                as={NavLink}
                to={item.to}
              >
                <Icon className={item.icon} />
                <span style={{ fontSize: "1.1rem" }}>{item.name}</span>
              </Menu.Item>))
          }
          {<Menu.Header as="h4" style={{ marginLeft: "1rem", marginBottom: "0.5rem", marginTop: "0.5rem" }}>图片工具</Menu.Header>}
          {
            MENU_ITEMS.filter((item) => item.show === 1).map((item) => (
              <Menu.Item
                className="compact"
                key={item.id}
                as={NavLink}
                to={item.to}
              >
                <Icon className={item.icon} />
                <span style={{ fontSize: "1.1rem" }}>{item.name}</span>
              </Menu.Item>))
          }
          {<Menu.Header as="h4" style={{ marginLeft: "1rem", marginBottom: "0.5rem", marginTop: "0.5rem" }}>用户相关</Menu.Header>}
          {
            MENU_ITEMS.filter((item) => item.show === 2 && item.id !== "message").map((item) => (
              <Menu.Item
                className="compact"
                key={item.id}
                as={NavLink}
                to={item.to}
              >
                <Icon className={item.icon} />
                <span style={{ fontSize: "1.1rem" }}>{item.name}</span>
              </Menu.Item>))
          }
          <Menu.Item
            className="compact"
            as={NavLink}
            to={"/message"}
          >
            <Icon className="envelope" />
            <div>
              <span style={{ fontSize: "1.1rem" }}>私信</span>
              {typeof unreadMessageCount.data !== "undefined" && unreadMessageCount.data.data.count !== 0
                && <Label color="blue" style={{ fontSize: "0.5rem", marginLeft: "0.5rem" }} content={
                  unreadMessageCount.data.data.count > 99 ? "99+" : unreadMessageCount.data.data.count} />
              }</div>
          </Menu.Item>
          <UserItem />
        </Sidebar >
      </>
    );
  };

  return (
    <>
      <Menu
        borderless
        style={{
          height: "4.2rem",
          borderRadius: 0,
          borderTopWidth: 0,
        }}
        fixed="top"
        className={styles.menu}
      >
        <Container>
          <Menu.Item as={Link} to="/">
            <img src="/icon.png" />
            {!isNarrowScreen && <span style={{
              marginLeft: "0.5rem",
              fontFamily: "Saira",
              fontWeight: 500,
              fontSize: "1.5rem",
            }}>
              A.R.O.N.A
            </span>}
          </Menu.Item>
          {isWideScreen && MENU_ITEMS.filter((item) => item.show === 0)
            .map((item) => (
              <Menu.Item
                className="compact"
                key={item.id}
                as={NavLink}
                to={item.to}
              >
                <Icon className={item.icon} />
                <span style={{ fontSize: "1.1rem" }}>{item.name}</span>
              </Menu.Item>
            )).concat(
              <Menu.Item
                className="compact"
                key={"tools"}
                onClick={() => setOpen2((x) => (!x))}
              >
                <Icon className={"wrench"} />
                <Dropdown text="工具" open={open2} onClick={() => setOpen2((x) => (!x))} pointing style={{ fontSize: "1.1rem" }}>
                  <Dropdown.Menu style={{ marginTop: "1.5rem", marginLeft: "-2.8rem" }}>
                    {MENU_ITEMS.filter((item) => item.show === 1)
                      .map((item) => (
                        <Menu.Item
                          // className="compact"
                          key={item.id}
                          as={NavLink}
                          to={item.to}
                        >
                          <Icon className={item.icon} />
                          <span style={{ fontSize: "1.1rem" }}>{item.name}</span>
                        </Menu.Item>
                      ))}
                  </Dropdown.Menu>
                </Dropdown>
              </Menu.Item>,

            )}
          {
            (typeof props.hideSearch === "undefined" || !props.hideSearch) &&
            <Menu.Item>
              <AronaInput
                type="input"
                icon="search"
                placeholder="在此处键入搜索内容"
                onChange={(e) => { setSearch(e); }}
                value={search}
                onConfirm={onSearch}
              />
              {
                !isNarrowScreen &&
                <Button
                  // primary
                  icon="right arrow"
                  style={{ marginLeft: isNarrowScreen ? "0.2rem" : "0.5rem" }}
                  onClick={onSearch}
                />
              }
            </Menu.Item>
          }

          {isWideScreen ? <RightPart me={self} setOpen={setOpen} /> : <MyDropdown />}
        </Container>
      </Menu >

      <div style={{ margin: "0 0 5rem 0" }}></div>
      <Container>
        {props.children}
      </Container>
      <Confirm
        open={open}
        onCancel={() => setOpen(false)}
        onConfirm={() => {
          setSelf(null);
          setOpen(false);
        }}
      />
    </>
  );
};

export default AppLayout;
