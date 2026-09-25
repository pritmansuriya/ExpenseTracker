import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileScreen() {
  const [darkMode, setDarkMode] = useState(false);

  const [profile, setProfile] = useState({
    name: "User",
    email: "user@example.com",
    phone: "+91 98765 43210",
  });

  const handlePress = (title: string) => {
    Alert.alert(title, `${title} screen will open here.`);
  };

  const loadProfile = async () => {
    try {
      const profileData = await AsyncStorage.getItem("profile");
      const userData = await AsyncStorage.getItem("user");

      let name = "";
      let email = "";
      let phone = "+91 98765 43210";

      if (userData) {
        const parsedUser = JSON.parse(userData);
        name = parsedUser.name || "";
        email = parsedUser.email || "";
      }

      if (profileData) {
        const parsedProfile = JSON.parse(profileData);
        if (parsedProfile.name) name = parsedProfile.name;
        if (parsedProfile.email) email = parsedProfile.email;
        if (parsedProfile.phone) phone = parsedProfile.phone;
      }

      setProfile({
        name: name || "User",
        email: email || "user@example.com",
        phone,
      });
    } catch (error) {
      console.log("Error loading profile:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadProfile();
    }, []),
  );

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          try {
            await AsyncStorage.setItem("loggedIn", "false");
            router.replace("/login");
          } catch (error) {
            console.log("Logout error:", error);
          }
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
        </View>

        {/* Profile Header */}
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <Image
              source={{
                uri: "https://i.pravatar.cc/300",
              }}
              style={styles.avatar}
            />

            <Pressable style={styles.cameraButton}>
              <Ionicons name="camera" size={16} color="#FFFFFF" />
            </Pressable>
          </View>

          <Text style={styles.name}>{profile.name}</Text>

          <Text style={styles.email}>{profile.email}</Text>

          <Pressable
            style={styles.editProfileButton}
            onPress={() => router.push("/edit-profile")}
          >
            <Ionicons name="create-outline" size={17} color="#2563EB" />

            <Text style={styles.editProfileText}>Edit Profile</Text>
          </Pressable>
        </View>

        {/* Personal Information */}
        <SectionTitle title="Personal Information" />

        <View style={styles.section}>
          <MenuItem icon="person-outline" title="Name" value={profile.name} />

          <MenuItem icon="mail-outline" title="Email" value={profile.email} />

          <MenuItem
            icon="call-outline"
            title="Mobile Number"
            value={profile.phone}
          />

          <MenuItem
            icon="create-outline"
            title="Edit Personal Information"
            onPress={() => router.push("/edit-profile")}
            showDivider={false}
          />

          <MenuItem
            icon="create-outline"
            title="My Account"
            onPress={() => router.push("/accounts")}
            showDivider={false}
          />
        </View>

        {/* Expense Settings */}
        <SectionTitle title="Expense Settings" />

        <View style={styles.section}>
          <MenuItem
            icon="cash-outline"
            title="Default Currency"
            value="₹ INR"
            onPress={() => handlePress("Currency")}
          />

          <MenuItem
            icon="swap-horizontal-outline"
            title="Default Transaction Type"
            value="Expense"
            onPress={() => handlePress("Default Transaction Type")}
          />

          <MenuItem
            icon="list-outline"
            title="Categories"
            onPress={() => handlePress("Categories")}
          />

          <MenuItem
            icon="wallet-outline"
            title="Monthly Budget"
            value="₹ 30,000"
            onPress={() => handlePress("Monthly Budget")}
            showDivider={false}
          />
        </View>

        {/* Notifications */}
        <SectionTitle title="Notifications" />

        <View style={styles.section}>
          <MenuItem
            icon="alarm-outline"
            title="Expense Reminders"
            onPress={() => handlePress("Expense Reminders")}
          />

          <MenuItem
            icon="notifications-outline"
            title="Budget Alerts"
            onPress={() => handlePress("Budget Alerts")}
          />

          <MenuItem
            icon="calendar-outline"
            title="Monthly Summary"
            onPress={() => handlePress("Monthly Summary")}
            showDivider={false}
          />
        </View>

        {/* Appearance */}
        <SectionTitle title="Appearance" />

        <View style={styles.section}>
          <MenuItem
            icon="moon-outline"
            title="Dark Mode"
            rightComponent={
              <Switch
                value={darkMode}
                onValueChange={setDarkMode}
                trackColor={{
                  false: "#CBD5E1",
                  true: "#93C5FD",
                }}
                thumbColor={darkMode ? "#2563EB" : "#F8FAFC"}
              />
            }
          />

          <MenuItem
            icon="sunny-outline"
            title="Light Mode"
            onPress={() => handlePress("Light Mode")}
          />

          <MenuItem
            icon="phone-portrait-outline"
            title="System Default"
            onPress={() => handlePress("System Default")}
            showDivider={false}
          />
        </View>

        {/* Security */}
        <SectionTitle title="Security" />

        <View style={styles.section}>
          <MenuItem
            icon="key-outline"
            title="Change Password"
            onPress={() => handlePress("Change Password")}
          />

          <MenuItem
            icon="lock-closed-outline"
            title="App Lock / PIN"
            onPress={() => handlePress("App Lock / PIN")}
          />

          <MenuItem
            icon="finger-print-outline"
            title="Biometric Login"
            onPress={() => handlePress("Biometric Login")}
            showDivider={false}
          />
        </View>

        {/* Other */}
        <SectionTitle title="Other" />

        <View style={styles.section}>
          <MenuItem
            icon="help-circle-outline"
            title="Help & Support"
            onPress={() => handlePress("Help & Support")}
          />

          <MenuItem
            icon="shield-checkmark-outline"
            title="Privacy Policy"
            onPress={() => handlePress("Privacy Policy")}
          />

          <MenuItem
            icon="information-circle-outline"
            title="About Expense Tracker"
            onPress={() => handlePress("About Expense Tracker")}
            showDivider={false}
          />
        </View>

        {/* Logout */}
        <Pressable style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={21} color="#DC2626" />

          <Text style={styles.logoutText}>Logout</Text>
        </Pressable>

        <Text style={styles.version}>Expense Tracker v1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

/* -------------------------------- */
/* Section Title                    */
/* -------------------------------- */

function SectionTitle({ title }: { title: string }) {
  return <Text style={styles.sectionTitle}>{title}</Text>;
}

/* -------------------------------- */
/* Menu Item                        */
/* -------------------------------- */

type MenuItemProps = {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  value?: string;
  onPress?: () => void;
  rightComponent?: React.ReactNode;
  showDivider?: boolean;
};

function MenuItem({
  icon,
  title,
  value,
  onPress,
  rightComponent,
  showDivider = true,
}: MenuItemProps) {
  return (
    <Pressable style={styles.menuItem} onPress={onPress}>
      <View style={styles.menuLeft}>
        <View style={styles.iconContainer}>
          <Ionicons name={icon} size={20} color="#2563EB" />
        </View>

        <View style={styles.menuTextContainer}>
          <Text style={styles.menuTitle}>{title}</Text>

          {value && <Text style={styles.menuValue}>{value}</Text>}
        </View>
      </View>

      {rightComponent ? (
        rightComponent
      ) : (
        <Ionicons name="chevron-forward" size={20} color="#94A3B8" />
      )}

      {showDivider && <View style={styles.divider} />}
    </Pressable>
  );
}

/* -------------------------------- */
/* Styles                           */
/* -------------------------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },

  scrollContent: {
    paddingBottom: 40,
  },

  header: {
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 10,
  },

  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#0F172A",
  },

  /* Profile */

  profileCard: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 16,
    marginTop: 10,
    borderRadius: 18,
    paddingVertical: 25,
    alignItems: "center",

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 5,
    elevation: 2,
  },

  avatarContainer: {
    position: "relative",
    marginBottom: 12,
  },

  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 3,
    borderColor: "#DBEAFE",
  },

  cameraButton: {
    position: "absolute",
    right: -2,
    bottom: 0,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#2563EB",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "#FFFFFF",
  },

  name: {
    fontSize: 21,
    fontWeight: "700",
    color: "#0F172A",
  },

  email: {
    fontSize: 14,
    color: "#64748B",
    marginTop: 4,
  },

  editProfileButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    marginTop: 15,
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: 8,
    backgroundColor: "#EFF6FF",
  },

  editProfileText: {
    color: "#2563EB",
    fontSize: 14,
    fontWeight: "600",
  },

  /* Sections */

  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#475569",
    marginHorizontal: 20,
    marginTop: 24,
    marginBottom: 9,
  },

  section: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 16,
    borderRadius: 14,
    overflow: "hidden",
  },

  menuItem: {
    minHeight: 64,
    paddingHorizontal: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    position: "relative",
  },

  menuLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  iconContainer: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  menuTextContainer: {
    flex: 1,
  },

  menuTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1E293B",
  },

  menuValue: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 3,
  },

  divider: {
    position: "absolute",
    bottom: 0,
    left: 65,
    right: 0,
    height: 1,
    backgroundColor: "#F1F5F9",
  },

  /* Logout */

  logoutButton: {
    marginHorizontal: 16,
    marginTop: 28,
    height: 54,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#FECACA",
    backgroundColor: "#FEF2F2",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  logoutText: {
    color: "#DC2626",
    fontSize: 16,
    fontWeight: "700",
  },

  version: {
    textAlign: "center",
    color: "#94A3B8",
    fontSize: 12,
    marginTop: 18,
  },
});
