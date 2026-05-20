import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const KEY = "labread:disclaimer-accepted";

export function DisclaimerModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(KEY)) setOpen(true);
    } catch {}
  }, []);

  const accept = () => {
    try { localStorage.setItem(KEY, "1"); } catch {}
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) return; setOpen(v); }}>
      <DialogContent className="sm:max-w-md" onPointerDownOutside={(e) => e.preventDefault()} onEscapeKeyDown={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Before you continue</DialogTitle>
          <DialogDescription className="pt-2 text-sm leading-relaxed">
            labread.health provides AI-powered explanations of lab results for informational purposes only.
            This is <strong>NOT a medical diagnosis</strong> and should <strong>NOT replace professional medical advice</strong>.
            By continuing, you agree to our{" "}
            <a href="/terms" target="_blank" rel="noreferrer" className="underline text-accent hover:opacity-80">Terms of Service</a>
            {" "}and{" "}
            <a href="/privacy" target="_blank" rel="noreferrer" className="underline text-accent hover:opacity-80">Privacy Policy</a>.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={accept} className="w-full sm:w-auto">I Understand</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
