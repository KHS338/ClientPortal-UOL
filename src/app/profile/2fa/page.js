"use client";

import { useState, useEffect } from "react";
import { FiShield, FiCopy, FiCheck, FiTrash2 } from "react-icons/fi";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import QRCode from "react-qr-code";

export default function TwoFactorAuthSettings() {
  const [user, setUser] = useState(null);
  const [isEnabled, setIsEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [setupData, setSetupData] = useState(null);
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showBackupCodes, setShowBackupCodes] = useState(false);
  const [copiedCodes, setCopiedCodes] = useState({});

  useEffect(() => {
    // Get user data from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      setIsEnabled(parsedUser.twoFactorEnabled || false);
    }
  }, []);

  const setup2FA = async () => {
    if (!user) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch('http://localhost:3001/users/2fa/setup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: user.id })
      });

      const result = await response.json();
      
      if (result.success) {
        setSetupData(result.twoFactorSetup);
      } else {
        setError(result.message || 'Failed to setup 2FA');
      }
    } catch (error) {
      console.error('2FA setup error:', error);
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const enable2FA = async () => {
    if (!user || !verificationCode) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch('http://localhost:3001/users/2fa/enable', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          userId: user.id, 
          token: verificationCode 
        })
      });

      const result = await response.json();
      
      if (result.success) {
        setIsEnabled(true);
        setSuccess('Two-factor authentication enabled successfully!');
        setSetupData(null);
        setVerificationCode('');
        setShowBackupCodes(true);
      } else {
        setError(result.message || 'Failed to enable 2FA');
      }
    } catch (error) {
      console.error('2FA enable error:', error);
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const disable2FA = async () => {
    if (!user || !verificationCode) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch('http://localhost:3001/users/2fa/disable', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          userId: user.id, 
          token: verificationCode 
        })
      });

      const result = await response.json();
      
      if (result.success) {
        setIsEnabled(false);
        setSuccess('Two-factor authentication disabled successfully!');
        setVerificationCode('');
        setShowBackupCodes(false);
      } else {
        setError(result.message || 'Failed to disable 2FA');
      }
    } catch (error) {
      console.error('2FA disable error:', error);
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedCodes(prev => ({ ...prev, [index]: true }));
    setTimeout(() => {
      setCopiedCodes(prev => ({ ...prev, [index]: false }));
    }, 2000);
  };

  const copyAllBackupCodes = () => {
    if (setupData && setupData.backupCodes) {
      const allCodes = setupData.backupCodes.join('\n');
      navigator.clipboard.writeText(allCodes);
      setCopiedCodes(prev => ({ ...prev, 'all': true }));
      setTimeout(() => {
        setCopiedCodes(prev => ({ ...prev, 'all': false }));
      }, 2000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            <FiShield className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Two-Factor Authentication</h1>
        <p className="text-gray-600">Secure your account with an additional layer of protection</p>
      </div>

      {/* Success Message */}
      {success && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="p-4 bg-green-50 border border-green-200 rounded-lg"
        >
          <p className="text-green-700 text-center">{success}</p>
        </motion.div>
      )}

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="p-4 bg-red-50 border border-red-200 rounded-lg"
        >
          <p className="text-red-700 text-center">{error}</p>
        </motion.div>
      )}

      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Two-Factor Authentication</h2>
            <p className="text-gray-600 text-sm mt-1">
              {isEnabled ? 'Your account is protected with 2FA' : 'Add an extra layer of security to your account'}
            </p>
          </div>
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
            isEnabled 
              ? 'bg-green-100 text-green-800' 
              : 'bg-gray-100 text-gray-800'
          }`}>
            {isEnabled ? 'Enabled' : 'Disabled'}
          </div>
        </div>

        {!isEnabled && !setupData && (
          <div className="text-center">
            <p className="text-gray-600 mb-4">
              Secure your account by enabling two-factor authentication. You'll need to verify your identity using a code from your authenticator app.
            </p>
            <Button
              onClick={setup2FA}
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isLoading ? 'Setting up...' : 'Enable Two-Factor Authentication'}
            </Button>
          </div>
        )}

        {setupData && !isEnabled && (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-4">Scan QR Code</h3>
              <div className="flex justify-center mb-4">
                <div className="bg-white p-4 rounded-lg shadow-md">
                  <QRCode
                    size={200}
                    style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                    value={setupData.otpAuthUrl}
                    viewBox={`0 0 200 200`}
                  />
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Scan this QR code with your authenticator app (Google Authenticator, Authy, etc.)
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Manual Entry</h4>
              <p className="text-sm text-gray-600 mb-2">If you can't scan the QR code, enter this code manually:</p>
              <div className="flex items-center space-x-2">
                <code className="bg-white px-3 py-2 rounded text-sm font-mono border flex-1">
                  {setupData.secret}
                </code>
                <Button
                  onClick={() => copyToClipboard(setupData.secret, 'secret')}
                  variant="outline"
                  className="p-2"
                >
                  {copiedCodes.secret ? <FiCheck className="w-4 h-4 text-green-600" /> : <FiCopy className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Verification Code
                </label>
                <input
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  placeholder="Enter 6-digit code"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-lg font-mono"
                  maxLength="6"
                />
              </div>

              <Button
                onClick={enable2FA}
                disabled={isLoading || verificationCode.length !== 6}
                className="w-full bg-green-600 hover:bg-green-700 text-white"
              >
                {isLoading ? 'Enabling...' : 'Enable Two-Factor Authentication'}
              </Button>
            </div>

            {/* Backup Codes */}
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-yellow-800">Backup Codes</h4>
                <Button
                  onClick={copyAllBackupCodes}
                  variant="outline"
                  className="text-sm"
                >
                  {copiedCodes.all ? <FiCheck className="w-4 h-4 text-green-600 mr-1" /> : <FiCopy className="w-4 h-4 mr-1" />}
                  Copy All
                </Button>
              </div>
              <p className="text-sm text-yellow-700 mb-3">
                Save these backup codes in a secure place. You can use them to access your account if you lose your authenticator device.
              </p>
              <div className="grid grid-cols-2 gap-2">
                {setupData.backupCodes.map((code, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <code className="bg-white px-2 py-1 rounded text-sm font-mono border flex-1">
                      {code}
                    </code>
                    <Button
                      onClick={() => copyToClipboard(code, index)}
                      variant="outline"
                      className="p-1"
                    >
                      {copiedCodes[index] ? <FiCheck className="w-3 h-3 text-green-600" /> : <FiCopy className="w-3 h-3" />}
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {isEnabled && (
          <div className="space-y-4">
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <p className="text-green-700 text-center">
                ✅ Two-factor authentication is enabled on your account
              </p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Disable Two-Factor Authentication</h4>
              <p className="text-sm text-gray-600 mb-4">
                To disable 2FA, enter a verification code from your authenticator app:
              </p>
              <div className="space-y-3">
                <input
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  placeholder="Enter 6-digit code"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-center text-lg font-mono"
                  maxLength="6"
                />
                <Button
                  onClick={disable2FA}
                  disabled={isLoading || verificationCode.length !== 6}
                  variant="destructive"
                  className="w-full bg-red-600 hover:bg-red-700 text-white"
                >
                  {isLoading ? 'Disabling...' : 'Disable Two-Factor Authentication'}
                </Button>
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
