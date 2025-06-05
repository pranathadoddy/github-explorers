import React from 'react';
import { Search } from "lucide-react";

const EmptyState: React.FC = () => (
    <div className="text-center py-16" data-testid="empty-state">
      <Search className="w-16 h-16 mx-auto mb-4 text-gray-300" />
      <h3 className="text-xl font-semibold text-gray-900 mb-2">Start exploring GitHub</h3>
      <p className="text-gray-600">Search for a username to discover repositories and user profiles.</p>
    </div>
  );

  export default EmptyState;