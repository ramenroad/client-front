import tw from "twin.macro";
import ramenroadLogo from "../../assets/images/logo.png";

const RamenroadLogo = () => <Logo src={ramenroadLogo} />;

export default RamenroadLogo;

const Logo = tw.img`
  w-98 h-24
`;
