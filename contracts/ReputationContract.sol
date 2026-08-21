// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title ReputationContract
 * @dev Maintains dynamic wallet reputation scores (0-100), tracks verified fraud cases,
 * false report penalties, and verification histories.
 */
contract ReputationContract {
    struct WalletProfile {
        address wallet;
        uint8 reputationScore;    // 0 - 100 (Default: 80 for new active wallets, 100 max)
        uint256 totalAnalyzedTx;
        uint256 verifiedFraudReports;
        uint256 falseReports;
        uint256 lastUpdated;
        bool isBlacklisted;
        bool isWhitelisted;
    }

    address public owner;
    address public daoContract;
    address public fraudRegistry;

    mapping(address => WalletProfile) public profiles;
    address[] public knownWallets;

    event ReputationUpdated(
        address indexed wallet,
        uint8 oldScore,
        uint8 newScore,
        uint256 verifiedFraudCount,
        string reason
    );

    event BlacklistStatusChanged(address indexed wallet, bool isBlacklisted);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can perform this action");
        _;
    }

    modifier onlyAuthorized() {
        require(
            msg.sender == owner || msg.sender == daoContract,
            "Caller not authorized"
        );
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function setDAOContract(address _dao) external onlyOwner {
        daoContract = _dao;
    }

    function setFraudRegistry(address _registry) external onlyOwner {
        fraudRegistry = _registry;
    }

    function getOrCreateProfile(address _wallet) internal returns (WalletProfile storage) {
        if (profiles[_wallet].wallet == address(0)) {
            profiles[_wallet] = WalletProfile({
                wallet: _wallet,
                reputationScore: 85, // Initial trusted baseline
                totalAnalyzedTx: 0,
                verifiedFraudReports: 0,
                falseReports: 0,
                lastUpdated: block.timestamp,
                isBlacklisted: false,
                isWhitelisted: false
            });
            knownWallets.push(_wallet);
        }
        return profiles[_wallet];
    }

    /**
     * @dev Called when a fraud report is verified by DAO validators
     */
    function recordVerifiedFraud(address _wallet, uint8 _penaltyPoints) external onlyAuthorized {
        WalletProfile storage profile = getOrCreateProfile(_wallet);
        uint8 oldScore = profile.reputationScore;

        profile.verifiedFraudReports += 1;
        profile.lastUpdated = block.timestamp;

        if (_penaltyPoints >= profile.reputationScore) {
            profile.reputationScore = 0;
        } else {
            profile.reputationScore -= _penaltyPoints;
        }

        if (profile.reputationScore <= 20) {
            profile.isBlacklisted = true;
            emit BlacklistStatusChanged(_wallet, true);
        }

        emit ReputationUpdated(_wallet, oldScore, profile.reputationScore, profile.verifiedFraudReports, "Verified Fraud Penalty");
    }

    /**
     * @dev Called when a reported transaction is verified as false positive
     */
    function recordFalsePositive(address _wallet, address _reporter) external onlyAuthorized {
        WalletProfile storage targetProfile = getOrCreateProfile(_wallet);
        uint8 oldScore = targetProfile.reputationScore;

        // Slight reputation rebound for victim wallet
        if (targetProfile.reputationScore <= 95) {
            targetProfile.reputationScore += 5;
        }

        // Penalize false reporter
        WalletProfile storage reporterProfile = getOrCreateProfile(_reporter);
        reporterProfile.falseReports += 1;
        if (reporterProfile.reputationScore > 10) {
            reporterProfile.reputationScore -= 10;
        }

        emit ReputationUpdated(_wallet, oldScore, targetProfile.reputationScore, targetProfile.verifiedFraudReports, "False Positive Clearance");
    }

    function getReputation(address _wallet) external view returns (WalletProfile memory) {
        if (profiles[_wallet].wallet == address(0)) {
            return WalletProfile({
                wallet: _wallet,
                reputationScore: 85,
                totalAnalyzedTx: 0,
                verifiedFraudReports: 0,
                falseReports: 0,
                lastUpdated: block.timestamp,
                isBlacklisted: false,
                isWhitelisted: false
            });
        }
        return profiles[_wallet];
    }
}
