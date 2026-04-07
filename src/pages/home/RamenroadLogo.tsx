import ramenroadLogo from "../../assets/images/logo.png";
import render from "@/shared/ui/render";

const RamenroadLogo = () => <Logo src={ramenroadLogo} />;

export default RamenroadLogo;

const Logo = render.img("h-24");
