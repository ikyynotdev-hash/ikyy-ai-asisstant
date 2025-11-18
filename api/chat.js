import fetch from "node-fetch";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { message } = req.query;
    if (!message) {
      return res.status(400).json({ reply: "Message tidak boleh kosong." });
    }

    try {
      const query = encodeURIComponent(message);
      const response = await fetch(`https://api.siputzx.my.id/api/ai/gita?q=${query}`);
      const data = await response.json();

      if (data.status) {
        res.status(200).json({ reply: data.data });
      } else {
        res.status(500).json({ reply: "AI tidak merespon." });
      }
    } catch (error) {
      res.status(500).json({ reply: error.message });
    }
  } else {
    res.status(405).json({ reply: "Method not allowed" });
  }
}
