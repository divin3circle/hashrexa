import ConnectButton from "@/components/ui/ConnectButton";

function Navbar() {
  return (
    <div className="flex items-center justify-between mt-4">
      <h1 className="text-2xl font-bold font-mono">hashrexa.</h1>
      <ConnectButton />
    </div>
  );
}

export default Navbar;
