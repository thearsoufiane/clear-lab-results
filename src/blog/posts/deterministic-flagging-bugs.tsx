// Post: "We Found 3 Bugs That Could Have Hurt Someone — Before Anyone Got Hurt"
// The `meta` object drives the index card + per-page SEO; `Content` is the body.

import { P, B, SectionHeading, BulletList, Callout } from "../blog-ui";
import type { BlogPostMeta } from "./types";

export const meta: BlogPostMeta = {
  slug: "deterministic-flagging-bugs",
  title:
    "We Found 3 Bugs That Could Have Hurt Someone — Before Anyone Got Hurt",
  date: "2026-06-25",
  category: "Engineering",
  readingMinutes: 4,
  excerpt:
    "Before shipping a new way of flagging abnormal blood results, we tested it against real lab reports. It caught three real bugs — each one could have shown someone a dangerously wrong result.",
  metaTitle:
    "We Found 3 Bugs That Could Have Hurt Someone — Before Anyone Got Hurt | labread",
  ogDescription:
    "Before shipping a new way of flagging abnormal blood results, we tested it against real lab reports. It caught three real bugs — each one could have shown someone a dangerously wrong result.",
};

export function Content() {
  return (
    <>
      <P>
        labread reads your blood test and tells you, in plain English, what each
        value means. The most important word in that sentence is{" "}
        <B>tells you</B>: if we label a normal value as a medical emergency — or
        quietly miss one that isn't — we've done real harm, not just shipped a
        bug. So before we rolled out a new flagging pipeline, we tested it
        against real reports. It caught three bugs. Each one could have shown
        someone a dangerously wrong result.
      </P>

      <SectionHeading>The change: let math decide, let the model explain</SectionHeading>
      <P>
        The old design asked a language model to do two jobs at once: decide
        whether a value was abnormal, and explain what that meant — in a single
        pass. That's a real risk. If the model misjudges a threshold, it states
        the wrong answer with the same confidence as the right one.
      </P>
      <P>
        So we split it. A deterministic rules engine — plain comparison logic, no
        AI — decides status by checking each value against its reference range.
        Only after that decision is made does an AI model get involved, and its
        job is narrow: explain the result in plain language. It never decides
        what the result is. A validation layer checks the AI's output afterward —
        if it tries to introduce a marker that wasn't there, or quietly change a
        status, the system catches it and reverts to the deterministic answer.
      </P>

      <SectionHeading>What testing actually found</SectionHeading>
      <P>
        Code review isn't testing. Before this went live, we ran real uploaded
        lab reports through the new pipeline and checked every output by hand.
      </P>

      <BulletList
        items={[
          [
            "Alias matching",
            `: Lab reports often write full marker names — "Thyroid Stimulating Hormone (TSH)" instead of just "TSH." Our matching logic only recognized exact text, so markers written this way were quietly falling through unrecognized.`,
          ],
          [
            "Missing markers",
            ": Common basic-metabolic-panel markers — sodium, potassium, calcium, BUN — weren't in our reference database at all.",
          ],
          [
            "Unit conversion (the one that mattered most)",
            ": A cholesterol value reported in mmol/L was being compared directly against a threshold written in mg/dL — two different measurement systems treated as the same number. This nearly flagged a completely normal HDL level as a medical emergency. In the same report, the identical bug was quietly hiding an LDL level that was genuinely high, reporting it as normal instead.",
          ],
        ]}
      />

      <Callout label="Why this matters">
        One bug. Two opposite failures — one nearly cried wolf, the other nearly
        stayed silent. That's exactly the kind of error that erodes trust in
        health AI, and exactly the kind that's invisible unless you go looking
        for it.
      </Callout>

      <SectionHeading>Proving it actually works</SectionHeading>
      <P>
        After fixing all three, we needed proof beyond our own test files. We
        found a real, anonymized blood test someone had posted publicly online,
        uploaded it to the live app exactly as a stranger would, and checked the
        result against the report's own numbers.
      </P>
      <P>
        Twenty markers. Three were genuinely outside their reference range — all
        three were correctly flagged. The other seventeen were correctly read as
        normal. Zero false alarms, zero missed results, and every reference range
        pulled directly from the report itself rather than a generic default.
      </P>

      <SectionHeading>Why we're telling you this</SectionHeading>
      <P>
        Because the alternative — a confident AI that's occasionally and
        invisibly wrong — is the actual risk in this category, and most tools
        don't talk about how they guard against it. We'd rather show our work:
        the bugs we found, how we found them, and the test that proved the fix
        held up on data we didn't write ourselves.
      </P>
      <P>
        <B>
          That's the bar we're holding labread to going forward. Not "trust the
          model" — show the test.
        </B>
      </P>
    </>
  );
}
