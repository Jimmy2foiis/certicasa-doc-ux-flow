
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Client } from "@/services/api/types";

interface ContactSectionProps {
  client: Client;
}

export const ContactSection = ({ client }: ContactSectionProps) => {
  const [editableEmail, setEditableEmail] = useState(client?.email || "");
  const [editablePhone, setEditablePhone] = useState(client?.phone || "");

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-4">Contact</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm text-gray-500 mb-2">Email</label>
          <Input
            type="email"
            value={editableEmail}
            onChange={(e) => setEditableEmail(e.target.value)}
            className="w-full"
            placeholder="email@example.com"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-500 mb-2">Téléphone</label>
          <Input
            type="tel"
            value={editablePhone}
            onChange={(e) => setEditablePhone(e.target.value)}
            className="w-full"
            placeholder="+34 XXX XXX XXX"
          />
        </div>
      </div>
    </div>
  );
};
